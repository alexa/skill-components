// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { Page, ProactiveOffer, PageToken, CatalogProviderRegistry, CatalogProvider, PropertyResult, RecommendationResult, PagingDirection } from "../catalog-provider";
import * as _ from 'lodash';

// Catalog provider for a fixed/static list of items; useful for testing, debugging, or real
// use cases utilizing a fixed catalog
export class FixedProvider<SearchConditions, Item> implements CatalogProvider<SearchConditions, Item>{
    public static NAME = "ac.FixedCatalogCursor";
 
    protected list: any[];
    private seenList: any[];
    private prevPageLength: number;
 
    constructor(list: any[], seenList: any[] = [], prevPageLength: number = 0) {
        this.list = list;
        this.seenList = seenList;
        this.prevPageLength = prevPageLength;
    }
 
    private search(searchConditions: SearchConditions, pageSize: number, pageToken?: PageToken, pagingDirection?: PagingDirection): RecommendationResult<SearchConditions, Item> {
        let rescopedFlag = false;
 
        let matchingData = this.getMatchingData(searchConditions);
 
        let firstIndex = 0;
        if (pageToken !== undefined) {
            firstIndex = parseInt(pageToken, 10);
        }

        //rescoping, when the search condition has no matching results
        if (matchingData.length === 0) {
            rescopedFlag = true;
            const unseenData = _.differenceWith(this.list, this.seenList, _.isEqual);
            if (unseenData.length === 0){
                matchingData = this.list;
                this.seenList = [];
                console.log("Seen list has all the items present in the original data")
            }
            else{
                matchingData = unseenData;
            }
            searchConditions = {} as SearchConditions;
            console.log("Rescoped Search");
        }

        //rescoping, after reaching the end of the matching data
        if (pageToken === undefined && pagingDirection === PagingDirection.NEXT){
            rescopedFlag = true;
            const unseenData = _.differenceWith(this.list, this.seenList, _.isEqual);
            if (unseenData.length === 0){
                matchingData = this.list;
                searchConditions = {} as SearchConditions;
                this.seenList = [];
                console.log("Seen list has all the items present in the original data")
            }
            else{
                matchingData = unseenData;
            }
        }
        // this gets updated when the PagingDirection is previous
        let newMatchingData = matchingData.slice(firstIndex, firstIndex + pageSize);
 
        if (pagingDirection === PagingDirection.PREVIOUS){
            if (this.prevPageLength !== this.seenList.length){
                this.seenList.splice(this.seenList.length-this.prevPageLength, this.prevPageLength);
                newMatchingData = this.seenList.slice(-pageSize);
            }
        }
 
        if (pagingDirection !== PagingDirection.PREVIOUS){
            this.seenList = this.seenList.concat(newMatchingData);
        }
        
        this.prevPageLength = newMatchingData.length;
 
        const nextPageStartIndex = firstIndex + pageSize;
        let nextPageToken: PageToken | undefined = undefined;
        //nextPageToken remains undefined in case of navigation that happens out of bounds (of the matching data)
        if (nextPageStartIndex < matchingData.length && !rescopedFlag &&
            !(pageToken === undefined &&  pagingDirection === PagingDirection.PREVIOUS && this.seenList.length!==this.prevPageLength)) {
            nextPageToken = nextPageStartIndex + "";
        }
 
        const prevPageStartIndex = firstIndex - pageSize;
        let prevPageToken: PageToken | undefined = undefined;
        if (prevPageStartIndex >= 0) {
            prevPageToken = prevPageStartIndex + "";
        }
 
        //filtering duplicates
        const finalItemArray = newMatchingData.filter((v,i,a)=>a.findIndex(v2=>(JSON.stringify(v2) === JSON.stringify(v)))===i);
 
        return {
            rescoped: rescopedFlag,
            searchConditions: searchConditions,
            offer: this.getOfferAfterSearch({
                rescoped: rescopedFlag,
                searchConditions: searchConditions,
                recommendations: {
                    items: finalItemArray,
                    itemCount: newMatchingData.length,
                    prevPageToken: prevPageToken,
                    nextPageToken: nextPageToken
                }
            }),
            recommendations: {
                items: finalItemArray,
                itemCount: finalItemArray.length,
                prevPageToken: prevPageToken,
                nextPageToken: nextPageToken
            }
        } as RecommendationResult<SearchConditions, Item>
    }
 
    performSearch(searchConditions: SearchConditions, pageSize: number): RecommendationResult<SearchConditions, Item> {
        const recommendationResult = this.search(searchConditions, pageSize);
        return {
            ...recommendationResult,
            offer: this.getOfferAfterSearch(recommendationResult)
        }
    }
 
    getRecommendationsPage(searchConditions: SearchConditions, pageSize: number, pageToken: PageToken | undefined, pagingDirection :PagingDirection): RecommendationResult<SearchConditions, Item> {
        const recommendationResult = this.search(searchConditions, pageSize, pageToken, pagingDirection);
        return {
            ...recommendationResult,
            offer: this.getOfferAfterGetRecommendationsPage(recommendationResult)
        }
    }
 
    selectItem(currentPage: Page<Item>, index: number): RecommendationResult<SearchConditions, Item> {
        this.seenList.push(currentPage.items[index]);
        return {
            rescoped: false,
            searchConditions: {} as SearchConditions,
            offer: this.getOfferAfterSelectItem(currentPage.items[index]),
            recommendations: {
                items: [currentPage.items[index]],
                itemCount: 1,
                prevPageToken: currentPage.prevPageToken,
                nextPageToken: currentPage.nextPageToken
            } as Page<Item>
        } as RecommendationResult<SearchConditions, Item>
    }
 
    getProperty(item: Item, propertyName: string): PropertyResult {
        if (typeof item == 'object') {
            const newItem = item as any;
            return {
                value: newItem[propertyName],
                offer: this.getOfferAfterGetProperty(newItem[propertyName], propertyName)
            } as PropertyResult
        }
        else {
            throw new Error("Item isn't an object");
        }
    }
    
    // returning a dummy string by default; skill developer will have
    // to override this method based on the requirement
    performAction(item: Item, actionName: string): string {
        console.log("Following action has been performed:", actionName);
 
        return "Result: Action successfully performed"
    }
 
    // search is performed by matching exact values, 
    // can be overriden by the skill developer according to the requirement,
    // for instance, searching by partial values
    protected getMatchingData(searchConditions: SearchConditions): any[] {
        const searchAttrs = _.keysIn(searchConditions);
 
        const dataByAttr = _.reduce(searchAttrs, (obj, attr) => {
            return {
                ...obj,
                [attr]: _.groupBy(this.list, (item) => item[attr].toLowerCase())
            };
        }, {});
 
        const searchConditionsObj = searchConditions as any;
        const dataByAttrObj = dataByAttr as any;
 
        let matchingData = searchAttrs.length === 0 ? this.list : _.intersection(..._.chain(searchAttrs)
            .map((attr) => {
                const attrValue = searchConditionsObj[attr].toLowerCase();
                console.log("Attr: " + attr);
                if (!attrValue || attrValue === "") {
                    // empty values indicates the value for the attribute was not really provided
                    return this.list;
                }
                const matchedEntries = dataByAttrObj[attr][attrValue];

                return matchedEntries;
            })
            .value());
        console.log(`Matching items Inside Provider:`, matchingData);
 
        return matchingData;
    }
 
    protected getOfferAfterSearch(recommendationResult: RecommendationResult<SearchConditions, Item>): ProactiveOffer | undefined {
        return undefined; // returning no offer by default, skill developer can override this method if required
    }
 
    protected getOfferAfterGetRecommendationsPage(recommendationResult: RecommendationResult<SearchConditions, Item>): ProactiveOffer | undefined {
        return undefined; // returning no offer by default, skill developer can override this method if required
    }
 
    protected getOfferAfterSelectItem(item: Item): ProactiveOffer | undefined {
        return undefined; // returning no offer by default, skill developer can override this method if required
    }
 
    protected getOfferAfterGetProperty(item: Item, propertyName: string): ProactiveOffer | undefined {
        return undefined // returning no offer by default, skill developer can override this method if required
    }
 
    serialize(): any {
        const config = {
            list: this.list,
            seenList: this.seenList,
            prevPageLength: this.prevPageLength
        }
        return config;
    }
 
    getName(): string {
        return FixedProvider.NAME;
    }
 
    static deserialize(config: any): FixedProvider<any, any> {
        return new FixedProvider(config.list, config.seenList, config.prevPageLength);
    }
}
// register the FixedProvider by name so it can be serialized properly
CatalogProviderRegistry.register(FixedProvider.NAME, FixedProvider.deserialize);