// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

import { apiNamespace } from '../config';
import { CatalogExplorer } from '../interface';
import { Page } from "../catalog-provider";
import { CatalogExplorerSessionState } from '../state';
import * as util from '../util';
import { BaseApiHandler } from './base-api-handler';

interface Arguments{
    // the page to retrieve an item from
    page: Page<any>;

    // the name of the item
    name: string;
}

export type ItemNameMatcher = (items: any[], name: string) => number | undefined;

// called when a user tries to select a item on the current page by name,
// utilizes a matcher callback to determine how to match an item to name;
// assuming each item simply has a "name" field by default
export class IndexOfItemByNameHandler extends BaseApiHandler {
    static defaultApiName = `${apiNamespace}.indexOfItemByNameApi`;

    // default matcher just assumes each item has a 'name' field that can be matched against
    static defaultItemNameMatcher: ItemNameMatcher = (items, name) => {
        return items.findIndex((item) => {
            return item?.name?.toLowerCase() == name;
        });
    }

    private itemNameMatcher: ItemNameMatcher;

    constructor(
        apiName: string = IndexOfItemByNameHandler.defaultApiName,
        itemNameMatcher: ItemNameMatcher = IndexOfItemByNameHandler.defaultItemNameMatcher,
    ) {
        super(apiName);
        this.itemNameMatcher = itemNameMatcher;
    }

    handle(handlerInput : HandlerInput): Response {
        const args = util.getApiArguments(handlerInput) as Arguments;

        let currentRecommendationsPage: Page<any>

        if(CatalogExplorer.useSessionArgs){
            currentRecommendationsPage = this.getRecommendationPageFromSession(handlerInput);
        }
        else{
            currentRecommendationsPage = args.page;
        }

        const index = this.itemNameMatcher(currentRecommendationsPage.items, args.name);
        if (index == undefined || index < 0) {
            throw new Error("indexOfItemByName: API called with name matching no displayed element");
        } else if (index >= currentRecommendationsPage.items.length) {
            throw new Error("indexOfItemByName: item matcher returned index out of bounds of current page");
        }else{
            console.log("indexOfItemByName: ",index);
        }

        return handlerInput.responseBuilder
            .withApiResponse(index+1) // index in ACDL currently starts at 1 to match ordinal
            .withShouldEndSession(false)
            .getResponse();
    }

    getRecommendationPageFromSession(handlerInput: HandlerInput): Page<any>{
        const sessionState = CatalogExplorerSessionState.load(handlerInput);

        const recommendationResultFromSession =  sessionState.argsState?.recommendationResult;
        if (recommendationResultFromSession === undefined){
            throw new Error("Recommendation Result from session state in undefined");
        }

        return recommendationResultFromSession.recommendations;
    }
}
