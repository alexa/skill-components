// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { Page, ProactiveOffer, PageToken, CatalogProviderRegistry, PropertyResult,CatalogProvider, RecommendationResult, PagingDirection } from "../catalog-provider";
import * as _ from 'lodash';
import { AttributeValue, DynamoDBClient, QueryCommand, QueryCommandInput, ScanCommand, ScanCommandInput} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { extend } from "lodash";
import { DescribeTableCommand } from "@aws-sdk/client-dynamodb";
// Catalog provider for a fixed/static list of items; useful for testing, debugging, or real
// use cases utilizing a fixed catalog
export class DDBListProvider<SearchConditions, Item>  implements CatalogProvider<SearchConditions, Item> {
    public static NAME = "ac.DDBListCursor";
    private region : string;
    private client : DynamoDBClient;
    private tableName : string;
    private seenList: any[];
    private key : string; //optional
    private lek : any;

    constructor(region: string, tableName : string, seenList: any[][] = [],key : string = "undefined",lek: any = undefined) {
        this.seenList = seenList;
        this.region = region;
        this.client = new DynamoDBClient({ region: this.region });
        this.tableName = tableName;
        this.key= key,
        this.lek = lek;
    }
    private async search_DDB(searchConditions: SearchConditions, pageSize: number, pageToken?: PageToken, pagingDirection?: PagingDirection): Promise<RecommendationResult<SearchConditions, Item>> {
        console.log("Incoming page Token: ", pageToken)
        let rescopedFlag  = false;
        let matchingData: any[] = [];
        let prevPageToken : PageToken | undefined = undefined;
        let currPageToken = pageToken;
        let nextPageToken:any;
        let loopInFlag = 0;

        //rescoping condition
        if(currPageToken === undefined && pagingDirection === PagingDirection.NEXT)
        {
            console.log("Rescoped");
            let results: any;
            try {
            results = await this.client.send(new DescribeTableCommand({TableName: this.tableName}));
            } catch (err) {
            console.error(err);
            }
            var count =0;
            let seenListEntries = new Set();  
            for(var i = 0; i < this.seenList.length; i++) {
                for(var j = 0; j < this.seenList[i].length; j++) {
                    seenListEntries.add(this.seenList[i][j].name);
                }
            }
            count = seenListEntries.size;
            console.log("Seen item Count", count);
            console.log("Items in table:", results.Table?.ItemCount)
            if(count === results.Table?.ItemCount)
            {
                loopInFlag = 1;
                rescopedFlag = true;
                this.seenList.length = 0;
                searchConditions = {} as SearchConditions;
                this.search_DDB(searchConditions,pageSize,undefined,undefined);

            }
            else
            {
                rescopedFlag = true;
                searchConditions = {} as SearchConditions;
                let unseenList = await this.getUnseenList(pageSize);
             
                if(unseenList.length > pageSize)
                {
                    unseenList = unseenList.slice(0, pageSize);

                }
                console.log("UnseenList: ", unseenList);
                this.seenList.push(unseenList);
                prevPageToken = this.seenList.length - 2 ;

                return {
                    loopInFlag : loopInFlag,
                    rescoped: rescopedFlag,
                    searchConditions: searchConditions,
                    offer: this.getOfferAfterSearch({
                        rescoped: rescopedFlag,
                        searchConditions: searchConditions,
                        recommendations: {
                            items: unseenList,
                            itemCount: unseenList.length,
                            prevPageToken: prevPageToken,
                            nextPageToken: undefined
                        }
                    }),
                    recommendations: {
                            items: unseenList,
                            itemCount: unseenList.length,
                            prevPageToken: prevPageToken,
                            nextPageToken: undefined
                        }
                } as RecommendationResult<SearchConditions, Item>

            }  
        }

        //Condition to get the page from the seen list directly instead of going to the DDB
        if(typeof(pageToken) === "number"  && pageToken <= this.seenList.length-1)
        {
            matchingData = this.seenList[pageToken]
        }
        else 
        {
            //When search condition is empty
            if(Object.keys(searchConditions as any).length === 0)
            {
               matchingData = await this.searchWithoutSearchConditions(pageSize,pageToken);
               if(matchingData.length === 0)
               {
                   console.log("Matching data length is zero therefore rescoping");
                   return this.search_DDB(searchConditions,pageSize,undefined,PagingDirection.NEXT); //rescoped
               }
            }
            else
            {
                matchingData = await this.searchWithSearchConditions(pageSize,currPageToken,searchConditions);
                if(matchingData.length === 0)
                {
                    console.log("Matching data length is zero therefore rescoping");
                    return this.search_DDB(searchConditions,pageSize,undefined,PagingDirection.NEXT); //rescoped
                }
            } 
        }
        if (pagingDirection === PagingDirection.PREVIOUS){
                prevPageToken= pageToken - 1 < 0? undefined : pageToken - 1 ;
                nextPageToken = pageToken + 1;
        }
        else{
            if(typeof(pageToken) === "number")
                prevPageToken = pageToken-1;
            else
                prevPageToken = (this.seenList.length === 0)? undefined : this.seenList.length-1;
            if(typeof(pageToken) === "number" && pageToken < this.seenList.length-1)
                nextPageToken = pageToken + 1;
            else
                nextPageToken = this.lek;

            if(typeof(pageToken) !== "number")
                this.seenList.push(matchingData); 
        }
        if(matchingData.length < pageSize)
            nextPageToken = undefined;
        console.log("Matching data", matchingData);
        console.log("prev page token", prevPageToken);
        console.log("next page token", nextPageToken);
        return {
            loopInFlag : loopInFlag,
            rescoped: rescopedFlag,
            searchConditions: searchConditions,
            offer: this.getOfferAfterSearch({
                rescoped: rescopedFlag,
                searchConditions: searchConditions,
                recommendations: {
                    items: matchingData,
                    itemCount: matchingData.length,
                    prevPageToken: prevPageToken,
                    nextPageToken: nextPageToken
                }
            }),
            recommendations: {
                items: matchingData,
                    itemCount: matchingData.length,
                    prevPageToken: prevPageToken,
                    nextPageToken: nextPageToken,
                },
        } as RecommendationResult<SearchConditions, Item>
    }
    async performSearch(searchConditions: SearchConditions, pageSize: number): Promise<RecommendationResult<SearchConditions, Item>> {
        const recommendationResult = await this.search_DDB(searchConditions, pageSize);
        return {
            ...recommendationResult,
            offer: this.getOfferAfterSearch(recommendationResult)
        }
    }
    async getRecommendationsPage(searchConditions: SearchConditions, pageSize: number, pageToken: PageToken | undefined, pagingDirection :PagingDirection): Promise<RecommendationResult<SearchConditions, Item> >{
        const recommendationResult = await this.search_DDB(searchConditions, pageSize, pageToken, pagingDirection);
        return {
            ...recommendationResult,
            offer: this.getOfferAfterGetRecommendationsPage(recommendationResult)
        }
    }
    protected async getUnseenList(pageSize: number): Promise<any[]> {
        let results: any ;
        var key : any;
        if(this.key === 'undefined')
        {
            try {
            results = await this.client.send(new DescribeTableCommand({TableName: this.tableName}));
            } catch (err) {
            console.error(err);
            }
            results.Table?.KeySchema?.forEach((ele: { KeyType: string; AttributeName: any; }) =>
            {
                    if(ele.KeyType === 'HASH')
                        key= ele.AttributeName;
            })
        }
        else
        {
            key=this.key;
        }
        let excludeList : any = [];
        let temp : any =[];
        let lek: any = undefined ;

        for(var i=0;i<this.seenList.length; i++)
        {
            temp = this.seenList[i].map((a: { [x: string]: any; }) => a[key]);
            for(var y = 0; y<temp.length ; y++)
            {
                excludeList.push(temp[y]);
            }
        }
        const filterExpression= "NOT #pk IN (" + excludeList.map((_: any, index: string) => ":pk" + index).join(", ") + ")";
        const expressionAttributeNames = { "#pk": key };
        let expressionAttributeValue : any = {};
        excludeList.forEach((key: any, index: string) => {
            expressionAttributeValue[":pk" + index] =  key ;
        });
        let unseenList: any[] = [];
        let scanResults: any ;
        do
        {
            let scanCommand: ScanCommandInput = {
            Limit : pageSize, 
            TableName : this.tableName,
            ExclusiveStartKey : lek,
            FilterExpression: filterExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: marshall(expressionAttributeValue),
            };

            try {
                scanResults = await this.client.send(new ScanCommand(scanCommand));
                (scanResults.Items || []).forEach(function (element: Record<string, AttributeValue>, index: any, array: any) {
                unseenList.push(unmarshall(element));
            });
            } catch (err) {
            console.error(err);
            }
            lek = scanResults.LastEvaluatedKey;
        } while(unseenList.length < pageSize && scanResults.LastEvaluatedKey !== undefined);
        return unseenList;
    }


    protected async searchWithoutSearchConditions(pageSize: number, pageToken : PageToken): Promise<any[]> {
        let list: any[] = [];
        let params: ScanCommandInput = {
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey: pageToken
        };
        const results = await this.client.send(new ScanCommand(params));
        // The primary key of the last item in the page, acts as the nextPageToken in this case
         this.lek = results.LastEvaluatedKey;
        
        (results.Items || []).forEach(function (element: any, index: any, array: any) {
            list.push(unmarshall(element));
        })
        return list;
    }
    protected async searchWithSearchConditions(pageSize: number, pageToken : PageToken,searchConditions : SearchConditions): Promise<any[]> {
        let matchingData : any =[];
        var sc_keys = _.keysIn(searchConditions);
        var sc_value= _.values(searchConditions);
        const values = [] ;
        const names = [] ;
        for(var i=1; i<= sc_keys.length; i++)
        {
            let key= ":col_" + i;
            values.push(key);
            let key1="#col_" + i;
            names.push(key1);
            
        }
        const ExpressionAttributeValues =  Object.fromEntries(values.map((v, i) => [v, (Number.isNaN(parseFloat(sc_value[i])))? sc_value[i] : parseInt(sc_value[i])  ]));
        const ExpressionAttributeNames =  Object.fromEntries(names.map((v, i) => [v, sc_keys[i]]));
        const key_condition= "#col_1 = :col_1"
        
        var indexName = sc_keys[0] + "-index"
        var filterExp= ""
        for(var i=2; i<= sc_keys.length; i++)
        {
            if (i == sc_keys.length)
                filterExp= filterExp + "#col_" + i + " = :col_" + i  
            else
                filterExp= filterExp + "#col_" + i + " = :col_" + i + " and "  
        }
        
        const params: QueryCommandInput = {
            TableName : this.tableName,
            IndexName : indexName,
            KeyConditionExpression: key_condition ,
            ExclusiveStartKey: pageToken ,
            Limit: pageSize, //1 
            ExpressionAttributeNames : ExpressionAttributeNames,
            ExpressionAttributeValues: marshall(ExpressionAttributeValues) 
        };
        if(filterExp !== "")
        {
            params.FilterExpression=filterExp
        }

        try {
            const results = await this.client.send(new QueryCommand(params));
            this.lek = results.LastEvaluatedKey;
            (results.Items || []).forEach(function (element: any, index: any, array: any) {
                matchingData.push(unmarshall(element));
            });
        } catch (err) {
            console.error(err);
        }
        return matchingData;
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
        let DDBconfig = {
            region : this.region,
            tableName : this.tableName,
            seenList: this.seenList,
            key : this.key,
            lek: this.lek
        }
        return DDBconfig;
    }

    getName(): string {
        return DDBListProvider.NAME;
    }

    static deserialize(DDBconfig: any): DDBListProvider<any, any>   {
        return new DDBListProvider(DDBconfig.region, DDBconfig.tableName,DDBconfig.seenList,DDBconfig.key,DDBconfig.lek);
    }
}

// register the DDBProvider by name so it can be serialized properly
CatalogProviderRegistry.register(DDBListProvider.NAME, DDBListProvider.deserialize);
