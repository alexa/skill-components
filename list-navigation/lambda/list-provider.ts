// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

// representation of a page token; simply a raw string as the real representation
// will differ with each list provider instance
export type PageToken = string;

// a single page of items, contains next/previous tokens to allow for easy navigation
export interface Page<T> {
    items: T[];

    // Note: will be undefined when at beginning of list
    prevPageToken?: PageToken;

    pageToken: PageToken;

    // Note: will be undefined when at end of list
    nextPageToken?: PageToken;
}

// alias for deserializer that can produce a list provider instance from
// a given set of serialized data (format different for each list provider);
// each list provider tyoe should define their own deserializer
export type ListProviderDeserializer = (data: any) => ListProvider<any>;

// interface every list provider must adhere to, contains methods used by
// list nav handlers when navigating through a list
export interface ListProvider<T> {
    // get a page of items for the given page token and page size; a undefined
    // page token is a request for the first page of items
    getPage(pageToken: PageToken | undefined, pageSize: number) : Page<T>;

    // called to serialize any state needed by a list provider instance; this
    // state will be passed into the list provider's deserializer on the next
    // API call
    serialize(): any;

    // unique name for a list provider type; used to find the deserilizer for
    // a list provider in the ListProviderRegistry
    getName(): string;
}

// Contains a static registry of list provider deserializers that can be used to 
// construct a list provider instance from the type "name" of the list provider
// and the state data required by the list provider
export class ListProviderRegistry {
    private static instance = new ListProviderRegistry();

    private cursorDeserializers: Record<string, ListProviderDeserializer> = {};

    static register(name: string, deserializer: ListProviderDeserializer) {
        this.instance.cursorDeserializers[name] = deserializer;
    }

    static getDeserializer(name: string) : ListProviderDeserializer {
        return this.instance.cursorDeserializers[name];
    }
}
