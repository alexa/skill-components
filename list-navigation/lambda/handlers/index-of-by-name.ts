// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

import { ListNav, Page } from '..';
import { apiNamespace } from '../config';
import { ListReference } from '../interface';
import { ListNavSessionState } from '../session-state';
import * as util from '../util';
import { BaseApiHandler } from './base-api-handler';

interface Arguments {
    // list to select an item from
    listRef: ListReference;

    // page to select an item from
    page: Page<any>;

    // name of the item to select
    name: string;
}

export type ItemNameMatcher = (items: any[], name: string) => number | undefined;

// called when a user tries to select a item on the current page by name,
// utilizes a matcher callback to determine how to match an item to name;
// assuming each item simply has a "name" field by default
export class IndexOfByNameHandler extends BaseApiHandler {
    static defaultApiName = `${apiNamespace}.indexOfByName`;

    // default matcher just assumes each item has a 'name' field that can be matched against
    static defaultItemNameMatcher: ItemNameMatcher = (items, name) => {
        return items.findIndex((item) => {
            return item?.name?.toLowerCase() == name;
        });
    }

    private itemNameMatcher: ItemNameMatcher;

    constructor(
        apiName: string = IndexOfByNameHandler.defaultApiName,
        itemNameMatcher: ItemNameMatcher = IndexOfByNameHandler.defaultItemNameMatcher,
    ) {
        super(apiName);
        this.itemNameMatcher = itemNameMatcher;
    }

    async handle(handlerInput : HandlerInput): Promise<Response>{
        const args = util.getApiArguments(handlerInput) as Arguments;

        let currentPage: Page<any>
        if (ListNav.useSessionArgs) {
            const sessionState = ListNavSessionState.load(handlerInput);
            currentPage = await sessionState.getCurrentPage();
            sessionState.validateArguments(args.listRef, args.page.pageToken);
        } else {
            currentPage = args.page;
        }

        const index = this.itemNameMatcher(currentPage.items, args.name);
        if (index == undefined || index < 0) {
            throw new Error("indexOfByName: API called with name matching no displayed element");
        } else if (index >= currentPage.items.length) {
            throw new Error("itemOfByName: item matcher returned index out of bounds of current page");
        }

        return handlerInput.responseBuilder
            .withApiResponse(index+1) // index in ACDL currently starts at 1 to match ordinal
            .withShouldEndSession(false)
            .getResponse();
    }
}
