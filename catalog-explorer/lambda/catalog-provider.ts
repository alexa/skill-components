// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

// representation of a page token; simply a raw string as the real representation
// will differ with each catalog provider instance
export type PageToken = any;

// a single page of items, contains next/previous tokens to allow for easy navigation
export interface Page<Item>{
    items: Item[];
    itemCount: number;
    prevPageToken?: PageToken;
    nextPageToken?: PageToken;
}

// Contains details about what kind of proactive offer to perform after a 
// recommendation is provided to a user
export interface ProactiveOffer{
    propertyName?: string;
    actionName?: string;
}

export interface RecommendationResult<SearchConditions, Item>{
    // true when the API decided that it wants to provide a recommendation that doesn't actually match the input
    // search conditions (usually due to exhausting all possible recommendations or just from user navigating to
    // the next recommendation too many times)
    rescoped: boolean;

    // the provided search conditions
    searchConditions: SearchConditions;

    // a page of recommended items
    recommendations: Page<Item>;

    // a proactive offer to be provided to the user
    offer?: ProactiveOffer;
}

export interface PropertyResult{
    value: string;

    // a proactive offer to be provided to the user
    offer?: ProactiveOffer;
}

// indicates whether the page being requested is the next page or the previous page
export enum PagingDirection{
    PREVIOUS = "previous",
    NEXT = "next"
}

// interface every catalog provider must adhere to,
// contains methods used by handlers
export interface CatalogProvider<SearchConditions, Item> {
    // search for the given search conditions and 
    // get a page of items for the given page size.
    performSearch(
        searchConditions: SearchConditions,
        pageSize: number
    ): RecommendationResult<SearchConditions, Item> | Promise<RecommendationResult<SearchConditions, Item>>;
    
    // get a page of items for the given search conditions, page token,
    // page size and paging direction
    getRecommendationsPage(
        searchConditions: SearchConditions, 
        pageSize: number,
        pageToken: PageToken | undefined,
        pagingDirection: PagingDirection
    ): RecommendationResult<SearchConditions, Item> | Promise<RecommendationResult<SearchConditions, Item>>;
    
    // selects the item at the given index from the provided page
    selectItem(
        currentPage: Page<Item>,
        index: number
    ): RecommendationResult<SearchConditions, Item>;
    
    // get the details for a given property name for the given item
    getProperty(
        item: Item,
        propertyName: string
    ): PropertyResult;
    
    // performs the provided action on the given item
    performAction(
        item: Item, 
        actionName: string
    ): string;
    
    // called to serialize any state needed by a catalog provider instance; this
    // state will be passed into the catalog provider's deserializer on the next
    // API call
    serialize(): any;
    
    // unique name for a catalog provider type; used to find the deserilizer for
    // a catalog provider in the CatalogProviderRegistry
    getName(): string;
}

// alias for deserializer that can produce a catalog provider instance from
// a given set of serialized data (format different for each catalog provider);
// each catalog provider tyoe should define their own deserializer
export type CatalogProviderDeserializer = (data: any) => CatalogProvider<any, any>;

// Contains a static registry of catalog provider deserializers that can be used to 
// construct a catalog provider instance from the type "name" of the catalog provider
// and the state data required by the catalog provider
export class CatalogProviderRegistry {
    private static instance = new CatalogProviderRegistry();

    private cursorDeserializers: Record<string, CatalogProviderDeserializer> = {};

    static register(name: string, deserializer: CatalogProviderDeserializer): void {
        this.instance.cursorDeserializers[name] = deserializer;
    }

    static getDeserializer(name: string) : CatalogProviderDeserializer {
        return this.instance.cursorDeserializers[name];
    }
}