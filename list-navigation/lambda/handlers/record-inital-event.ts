// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

import { apiNamespace } from '../config';
import { ListNav } from '../interface';
import { DDBListProvider } from '../providers/ddb-list-provider';
import { ListNavSessionState } from '../session-state';
import { BaseApiHandler } from './base-api-handler';

// handler for API called when navigating a list is just beginning; sets up some
// session state if ListNav.useSession is true
export class RecordInitialEventHandler extends BaseApiHandler {
    static defaultApiName = `${apiNamespace}.pagination.recordInitialEvent`;

    constructor(
        apiName: string = RecordInitialEventHandler.defaultApiName
    ) {
        super(apiName);
    }

    handle(handlerInput : HandlerInput): Response {

        if (ListNav.useSession) {
            const sessionState = ListNavSessionState.load(handlerInput);

            // reset page tokens to ensure we start navigating list at beginning, as it's 
            // possible a custom user event was just triggered to restart navigation
            // of a list that was setup before and already navigated some

            //Stack gets initialized, in case of DDBListProvider
            if(ListNav.getProvider(sessionState.activeList).getName() == DDBListProvider.NAME){
                sessionState.pageStack = [];
            }
            sessionState.currentPageTokens = undefined;
            sessionState.upcomingPageToken = undefined;
            sessionState.save(handlerInput);
        }

        return handlerInput.responseBuilder
            .withApiResponse({})
            .withShouldEndSession(false)
            .getResponse();
    }
}
