// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { ListProvider, ListProviderRegistry, Page, PageToken, PagingDirection } from '../list-provider';
import { DynamoDBClient, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import * as _ from 'lodash';

// List provider for a list of items present in a DynamoDB table; useful for testing, debugging, or real
// use cases utilizing a list of items present in a DynamoDB table; 
// each page token is simply a reference to the ExclusiveStartKey i.e. 
// the primary key of the first item in the page being requested
export class DDBListProvider<T> implements ListProvider<T> {
    public static NAME = "ac.DDBListCursor";
    private region : string;
    private client : DynamoDBClient;
    private tableName : string;
    private pageTokenStack: PageToken[];
    private maxPageTokenStackSize: number;

    constructor(region: string, tableName : string, maxPageTokenStackSize: number = 30, pageTokenStack: PageToken[] = []) {
        this.region = region;
        this.client = new DynamoDBClient({ region: this.region });
        this.tableName = tableName;
        this.pageTokenStack = pageTokenStack;
        this.maxPageTokenStackSize = maxPageTokenStackSize;
    }

    async getPage(currPageToken: PageToken | undefined, pageSize: number, pagingDirection: PagingDirection | undefined) : Promise<Page<T>> {
        let params: ScanCommandInput = {
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey: currPageToken
        };

        const results = await this.client.send(new ScanCommand(params));
        // The primary key of the last item in the page, acts as the nextPageToken in this case
        const lek = results.LastEvaluatedKey;
        const dataDDB:any[] = [];
        
        (results.Items || []).forEach(function (element, index, array) {
            dataDDB.push(unmarshall(element));
        });

        if (dataDDB.length === 0){
            // edge case, where the LastEvaluatedKey is not undefined but there are no unseen elements left in the table
            return this.getPage(undefined, pageSize, pagingDirection);
        }

        let prevPageToken : PageToken | undefined = undefined;
        if (pagingDirection === PagingDirection.PREVIOUS){
            this.pageTokenStack.pop();
            prevPageToken = this.pageTokenStack[this.pageTokenStack.length-2];
        }
        else{
            prevPageToken = this.pageTokenStack[this.pageTokenStack.length-1];
            this.pageTokenStack.push(currPageToken);
            // evicting least recently used pageTokens, to avoid cases exceeding session memory limit
            if (this.pageTokenStack.length>this.maxPageTokenStackSize){
                this.pageTokenStack.shift();
            }
        }

        return {
            items: dataDDB,
            pageToken: currPageToken,
            prevPageToken: prevPageToken,
            nextPageToken: lek
        };
    }

    serialize(): any {
        let DDBconfig = {
            region : this.region,
            tableName : this.tableName,
            maxPageTokenStackSize: this.maxPageTokenStackSize,
            pageTokenStack: this.pageTokenStack
        }
        return DDBconfig;
    }

    getName(): string {
        return DDBListProvider.NAME;
    }

    static deserialize(DDBconfig: any): DDBListProvider<any> {
        return new DDBListProvider(DDBconfig.region, DDBconfig.tableName, DDBconfig.maxPageTokenStackSize, DDBconfig.pageTokenStack);
    }
}

// register the DDBListProvider by name so it can be serialized properly
ListProviderRegistry.register(DDBListProvider.NAME, DDBListProvider.deserialize);