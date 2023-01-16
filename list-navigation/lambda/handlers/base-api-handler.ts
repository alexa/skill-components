// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";
import { ListNav, ListReference } from '../interface';
import { ListNavSessionState } from '../session-state';

import * as util from '../util';

// base class for Alexa Conversations API handlers
export abstract class BaseApiHandler implements RequestHandler {
    private apiName : string;

    constructor(
        apiName: string
    ) {
        this.apiName = apiName;
    }

    canHandle(handlerInput : HandlerInput): boolean {
        return util.isApiRequest(handlerInput, this.apiName);
    }

    abstract handle(handlerInput : HandlerInput): Response | Promise<Response>;

    // returns activeList from session, when session is used instead of focus or
    // when there is no active list reference provided in the arguments
    getActiveList(handlerInput : HandlerInput, listRef: ListReference | undefined): ListReference{
        if (ListNav.useSessionArgs || listRef === undefined){
            const sessionState = ListNavSessionState.load(handlerInput);
            return sessionState.activeList;
        }
        else{
            return listRef;
        }
    }
}
