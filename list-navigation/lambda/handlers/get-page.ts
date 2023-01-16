// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

import { apiNamespace } from '../config';
import { ListNav, ListReference } from '../interface';
import { ListProvider, Page, PagingDirection } from '../list-provider';
import { ListNavSessionState, PageTokens } from '../session-state';
import * as util from '../util';
import { BaseApiHandler } from './base-api-handler';

interface Arguments {
    // reference to list being navigated
    listRef: ListReference;   

    // indicates the page to retrieve
    pageToken: string;
}

// called to get a specific page from the list being navigated with (identified by a given
// page token). Will actually rely on data stored in session state instead of arguments passed 
// in API call if ListNav.useSessionArgs is true
export class GetPageHandler extends BaseApiHandler {
    static defaultApiName = `${apiNamespace}.getPage`;

    constructor(
        apiName: string = GetPageHandler.defaultApiName
    ) {
        super(apiName);
    }

    async handle(handlerInput : HandlerInput): Promise<Response>{
        const args = util.getApiArguments(handlerInput) as Arguments;

        let page : Promise<Page<any>>;
        const listRef = super.getActiveList(handlerInput, args.listRef);

        if (ListNav.useSessionArgs) {
            page = this.getNewPageFromSession(handlerInput, args, listRef);
        }
        else {
            const sessionState = ListNavSessionState.load(handlerInput);
            const providerState = sessionState.providerState;
            const listProvider: ListProvider<any> = ListNav.getProvider(listRef, providerState);

            // needs to be refactored for pagingDirection, once support for generics on actions is added
            const pagingDirection = PagingDirection.NEXT;
            page = listProvider.getPage(args.pageToken, listRef.pageSize, pagingDirection);
        }
        const pageResult = await page;

        const responsePage = {
            items: pageResult.items,
            itemCount: pageResult.items.length,

            prevPageToken: pageResult.prevPageToken,
            pageToken: pageResult.pageToken,
            nextPageToken: pageResult.nextPageToken
        };

        return handlerInput.responseBuilder
            .withApiResponse(responsePage)
            .withShouldEndSession(false)
            .getResponse();
    }

    async getNewPageFromSession(handlerInput : HandlerInput, args: Arguments, listRef: ListReference): Promise<Page<any>>{
        const sessionState = ListNavSessionState.load(handlerInput);
        const providerState = sessionState.providerState;

        const listProvider: ListProvider<any> = ListNav.getProvider(listRef, providerState);
        
        // get page token out of session instead of arguments
        const pageToken = sessionState.argsState?.upcomingPageToken;
        const pagingDirection = sessionState.argsState?.pagingDirection;
        let page = await listProvider.getPage(pageToken, listRef.pageSize, pagingDirection);

        // save new current page to session
        sessionState.providerState = listProvider.serialize();
        sessionState.argsState!.currentPageTokens = {
            prevPageToken: page.prevPageToken,
            currentPageToken: page.pageToken,
            nextPageToken: page.nextPageToken
        } as PageTokens;
        sessionState.argsState!.upcomingPageToken = undefined; // will be set again before next call to getPage API
        sessionState.save(handlerInput);

        sessionState.validateArguments(args.listRef, args.pageToken);
        return page;
    }
}
