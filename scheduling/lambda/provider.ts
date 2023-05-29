// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { ListProvider } from "@alexa-skill-components/list-navigation";

export interface SchedulingResult{
    schedulingSuccess: boolean
    details: string
}

export interface SchedulingProvider<SchedulingInfo> {
    schedule(
        schedulingInfo: SchedulingInfo
    ): SchedulingResult | Promise<SchedulingResult>;

    showBookingsListProvider(): ListProvider<any>;

    modify(
        newSchedulingInfo: SchedulingInfo,
        prevSchedulingInfo?: SchedulingInfo
    ): SchedulingResult | Promise<SchedulingResult>;

    cancel(
        schedulingInfo: SchedulingInfo
    ): SchedulingResult | Promise<SchedulingResult>;

    serialize(): any;

    getName(): string;
}

export type ProviderDeserializer = (data: any) => SchedulingProvider<any>;

export class ProviderRegistry{
    private static instance = new ProviderRegistry();

    private cursorDeserializers: Record<string, ProviderDeserializer> = {};

    static register(name: string, deserializer: ProviderDeserializer): void {
        this.instance.cursorDeserializers[name] = deserializer;
    }

    static getDeserializer(name: string): ProviderDeserializer {
        return this.instance.cursorDeserializers[name];
    }
}