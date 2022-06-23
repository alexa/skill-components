// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { ListProvider, ListProviderRegistry, Page, PageToken } from '../list-provider';

// List provider for a fixed/static list of items; useful for testing, debugging, or real
// use cases utilizing a fixed list; each page token is simply a reference to the index of the
// first item in the page being requested.
export class FixedListProvider<T> implements ListProvider<T> {
    public static NAME = "ac.FixedListCursor";

    private list : T[];

    constructor(list: T[]) {
        this.list = list;
    }

    getPage(pageToken: PageToken | undefined, pageSize: number) : Page<T> {
        // parse the first index of the page out of the page token or use 
        // start of list if no page token provided
        let firstIndex = 0;
        if (pageToken !== undefined) {
            firstIndex = parseInt(pageToken, 10);
        } else {
            pageToken = firstIndex + "";
        }

        // return subarray [index...index + pageLength). A partial list may be returned when 
        // reaching the boundary of the list.
        const items = this.list.slice(firstIndex, firstIndex + pageSize);

        console.log(`FixedListProvider: items are: ${JSON.stringify(items)}`);

        // calculate next page token; if at end of list, then set next token to undefined,
        // causing the list to loop around if passed back in
        const nextPageStartIndex = firstIndex + pageSize;
        let nextPageToken: PageToken | undefined = undefined;
        if (nextPageStartIndex < this.list.length) {
            nextPageToken = nextPageStartIndex + "";
        }

        // calculate previous page token; if at beginning of list, then set previous token
        // to undefined, causing the beginning of list to be reiterated if passed back in
        const prevPageStartIndex = firstIndex - pageSize;
        let prevPageToken: PageToken | undefined = undefined;
        if (prevPageStartIndex > 0) {
            prevPageToken = prevPageStartIndex + "";
        }

        return {
            items: items,

            prevPageToken: prevPageToken,
            pageToken: pageToken,
            nextPageToken: nextPageToken
        };
    }

    serialize(): any {
        // just serilize whole list
        return this.list;
    }

    getName(): string {
        return FixedListProvider.NAME;
    }

    static deserialize(data: any): FixedListProvider<any> {
        return new FixedListProvider(data);
    }
}

// register the FixedListProvider by name so it can be serialized properly
ListProviderRegistry.register(FixedListProvider.NAME, FixedListProvider.deserialize);