// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import * as _ from 'lodash';
import { DeleteItemCommand, DeleteItemCommandInput, DynamoDBClient, GetItemCommand, GetItemCommandInput, PutItemCommand, PutItemCommandInput, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { DDBListProvider, ListProvider } from '@alexa-skill-components/list-navigation';

import { ProviderRegistry, SchedulingProvider, SchedulingResult} from '@alexa-skill-components/scheduling';

export class CustomProvider implements SchedulingProvider<any>{
    public static NAME = "ac.customProvider";

    private region : string;
    private tableName : string;
    private client: DynamoDBClient;

    constructor(showRegion: string, showTableName : string) {
        this.region = showRegion;
        this.client = new DynamoDBClient({ region: this.region });
        this.tableName = showTableName;
    }

    async schedule(schedulingInfo: any): Promise<SchedulingResult> {
        const params: PutItemCommandInput = {
            TableName: this.tableName,
            Item: marshall({
                "restaurantName":  schedulingInfo.restaurantName,
                "date": schedulingInfo.date,
                "time": schedulingInfo.time,
                "label": schedulingInfo.restaurantName + " for " + schedulingInfo.date,
                "name": schedulingInfo.restaurantName
            })
        };

        const results = await this.client.send(new PutItemCommand(params));
        console.log("Schedule Result:", results);
        
        return {
            schedulingSuccess: true,
            details: "Booking was successful! You've booked a table at " + schedulingInfo.restaurantName + " for " + schedulingInfo.date + ", " + schedulingInfo.time + "."
        } as SchedulingResult
    }
    
    showBookingsListProvider(): ListProvider<any>{
        const providerObject = new DDBListProvider(this.region, this.tableName);
        return providerObject;
    }

    async modify(newSchedulingInfo: any, prevSchedulingInfo: any): Promise<SchedulingResult> {
        const readParams: GetItemCommandInput = {
            TableName: this.tableName,
            Key: marshall({
                "restaurantName":  prevSchedulingInfo.restaurantName
            }),
          };

        const existingResult = await this.client.send(new GetItemCommand(readParams));
        
        const prevDate = existingResult.Item?.date.S;
        const prevTime = existingResult.Item?.time.S;

        let bookingDetails : string;
        
        console.log(prevDate, prevTime);

        let params: PutItemCommandInput;
        if (newSchedulingInfo.time !== undefined && newSchedulingInfo.date !== undefined){
                params = {
                TableName: this.tableName,
                Item: marshall({
                    "restaurantName":  prevSchedulingInfo.restaurantName,
                    "date": newSchedulingInfo.date,
                    "time": newSchedulingInfo.time,
                    "label": prevSchedulingInfo.restaurantName + " for " + newSchedulingInfo.date,
                    "name": prevSchedulingInfo.restaurantName
                })
            };
            bookingDetails = "Your booking at " + prevSchedulingInfo.restaurantName + " was successfully modified to " + newSchedulingInfo.date + ", " + newSchedulingInfo.time + ".";
        }

        else if (newSchedulingInfo.time !== undefined){
            params = {
                TableName: this.tableName,
                Item: marshall({
                    "restaurantName":  prevSchedulingInfo.restaurantName,
                    "date": prevDate,
                    "time": newSchedulingInfo.time,
                    "label": prevSchedulingInfo.restaurantName + " for " + prevDate,
                    "name": prevSchedulingInfo.restaurantName
                })
            };
            bookingDetails = "Your booking at " + prevSchedulingInfo.restaurantName + " was successfully modified to " + prevDate + ", " + newSchedulingInfo.time + ".";
        }

        else {
            params = {
                TableName: this.tableName,
                Item: marshall({
                    "restaurantName":  prevSchedulingInfo.restaurantName,
                    "date": newSchedulingInfo.date,
                    "time": prevTime,
                    "label": prevSchedulingInfo.restaurantName + " for " + newSchedulingInfo.date,
                    "name": prevSchedulingInfo.restaurantName
                })
            };
            bookingDetails = "Your booking at " + prevSchedulingInfo.restaurantName + " was successfully modified to " + newSchedulingInfo.date + ", " + prevTime + ".";
        }

        const results = await this.client.send(new PutItemCommand(params));
        console.log("Modify Result:", results);
        
        return {
            schedulingSuccess: true,
            details: bookingDetails
        } as SchedulingResult
    }

    async cancel(schedulingInfo: any): Promise<SchedulingResult>{
        console.log(schedulingInfo, schedulingInfo.restaurantName);
        const params: DeleteItemCommandInput = {
            TableName: this.tableName,
            Key: marshall({
              "restaurantName":  schedulingInfo.restaurantName,
            })
        };

        const results = await this.client.send(new DeleteItemCommand(params));
        console.log("Cancel Result:", results);

        return {
            schedulingSuccess: true,
            details: "Your booking at " + schedulingInfo.restaurantName + " was cancelled"
        } as SchedulingResult
    }

    serialize(): any {
        let config = {
            region : this.region,
            tableName : this.tableName
        }
        return config;
    }

    getName(): string {
        return CustomProvider.NAME;
    }

    static deserialize(config: any): CustomProvider {
        return new CustomProvider(config.region, config.tableName);
    }
}

ProviderRegistry.register(CustomProvider.NAME, CustomProvider.deserialize);