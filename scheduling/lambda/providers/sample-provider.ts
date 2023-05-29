// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import * as _ from 'lodash';
import { DDBListProvider, ListProvider } from '@alexa-skill-components/list-navigation';

import {ProviderRegistry, SchedulingProvider, SchedulingResult} from '../provider';

export class SampleSchedulingProvider<SchedulingInfo> implements SchedulingProvider<SchedulingInfo>{
    public static NAME = "ac.SampleSchedulingCursor";

    private region : string;
    private tableName : string;

    constructor(region: string, tableName : string) {
        this.region = region;
        this.tableName = tableName;
    }

    schedule(schedulingInfo: SchedulingInfo): SchedulingResult {
        return {
            schedulingSuccess: true,
            details: JSON.stringify(schedulingInfo)
        } as SchedulingResult
    }

    showBookingsListProvider(): ListProvider<any>{
        const providerObject = new DDBListProvider(this.region, this.tableName);
        return providerObject;
    }

    modify(schedulingInfo: SchedulingInfo): SchedulingResult {
        return {
            schedulingSuccess: true,
            details: JSON.stringify(schedulingInfo)
        } as SchedulingResult
    }

    cancel(schedulingInfo: SchedulingInfo): SchedulingResult{
        return {
            schedulingSuccess: true,
            details: JSON.stringify(schedulingInfo)
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
        return SampleSchedulingProvider.NAME;
    }

    static deserialize(config: any): SampleSchedulingProvider<any> {
        return new SampleSchedulingProvider(config.region, config.tableName);
    }
}

ProviderRegistry.register(SampleSchedulingProvider.NAME, SampleSchedulingProvider.deserialize);
