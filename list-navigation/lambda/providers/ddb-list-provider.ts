// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { ListProvider, ListProviderRegistry, Page, PageToken } from '../list-provider';

import { DynamoDBClient, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import * as _ from 'lodash';

export class DDBListProvider<T> implements ListProvider<T> {
    public static NAME = "ac.DDBListCursor";
    private region : string;
    private client : DynamoDBClient;
    private tableName : string;

    constructor(region: string, tableName : string) {
        this.region = region;
        this.client = new DynamoDBClient({ region: this.region });
        this.tableName = tableName;
    }

    async getPage(currPageToken: PageToken | undefined, pageSize: number){
        
        const params: ScanCommandInput = {
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey: currPageToken
        };

        const cred = await this.client.config.credentials();
        console.log(cred);

        const results = await this.client.send(new ScanCommand(params));
        const lek = results.LastEvaluatedKey;
        const RAW_DATA:any[] = [];
        
        (results.Items || []).forEach(function (element, index, array) {
            RAW_DATA.push(unmarshall(element));
        });

        // modified data to give it a name and label property; only relevant in this particular example, will be made generic before releasing
        const DATA:any = _.chain(_.range(0, RAW_DATA.length))
        .map((i) => ({
            ...RAW_DATA[i],
            id: i,
            name: RAW_DATA[i].title,
            label: `${RAW_DATA[i].title} by ${RAW_DATA[i].author}`
        })).value();

        console.log(`DDBListProvider: items are: ${JSON.stringify(DATA)}`);

        return {
            items: DATA,
            pageToken: currPageToken,
            nextPageToken: lek
        };
    }

    serialize(): any {
        let DDBconfig = {
            region : this.region,
            tableName : this.tableName
        }
        return DDBconfig;
    }

    getName(): string {
        return DDBListProvider.NAME;
    }

    static deserialize(DDBconfig: any): DDBListProvider<any> {
        return new DDBListProvider(DDBconfig.region, DDBconfig.tableName);
    }
}

// register the DDBListProvider by name so it can be serialized properly
ListProviderRegistry.register(DDBListProvider.NAME, DDBListProvider.deserialize);

