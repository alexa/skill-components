// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";
import { PagingDirection } from '../catalog-provider';
import { apiNamespace } from '../config';
import { CatalogExplorer } from '../interface';
import { CatalogExplorerSessionState } from '../state';
import { BaseApiHandler } from './base-api-handler';

// handler for API called when the previous page is requested by the user before the
// getPage API is called; sets some session state if CatalogExplorer.useSession is true

export class RecordPrevEventHandler extends BaseApiHandler {
    static defaultApiName = `${apiNamespace}.navigate.recordPrevEvent`;

    constructor(
        apiName: string = RecordPrevEventHandler.defaultApiName
    ) {
        super(apiName);
    }

    handle(handlerInput : HandlerInput): Response {

        if (CatalogExplorer.useSession) {
            const sessionState = CatalogExplorerSessionState.load(handlerInput);
            const currentPageTokens = sessionState.argsState.currentPageTokens;

            if (currentPageTokens == undefined) {
                // shouldn't be possible, as initial getPage API call should have set the
                // current page tokens
                throw new Error("No current page info in catalog explorer session state");
            }
            sessionState.argsState.upcomingPageToken = currentPageTokens.prevPageToken;
            sessionState.argsState.pagingDirection = PagingDirection.PREVIOUS;
            sessionState.save(handlerInput);
        }

        return handlerInput.responseBuilder
            .withApiResponse({})
            .withShouldEndSession(false)
            .getResponse();
    }
}