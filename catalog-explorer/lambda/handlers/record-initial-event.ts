// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";
import { apiNamespace } from '../config';
import { CatalogExplorer } from '../interface';
import { CatalogExplorerSessionState } from '../state';
import { BaseApiHandler } from './base-api-handler';

// session state if CatalogExplorer.useSessionArgs is true
export class RecordInitialEventHandler extends BaseApiHandler {
    static defaultApiName = `${apiNamespace}.navigate.recordInitialEvent`;

    constructor(
        apiName: string = RecordInitialEventHandler.defaultApiName
    ) {
        super(apiName);
    }

    handle(handlerInput : HandlerInput): Response {

        if (CatalogExplorer.useSessionArgs) {
            const sessionState = CatalogExplorerSessionState.load(handlerInput);

            // reset page tokens to ensure we start navigating catalog at beginning, as it's 
            // possible a custom user event was just triggered to restart navigation
            // of a catalog that was setup before and already navigated some

            sessionState.argsState!.currentPageTokens = undefined;
            sessionState.argsState!.upcomingPageToken = undefined;
            sessionState.save(handlerInput);
        }

        return handlerInput.responseBuilder
            .withApiResponse({})
            .withShouldEndSession(false)
            .getResponse();
    }
}
