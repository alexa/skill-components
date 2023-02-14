// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";
import { CatalogExplorer, CatalogReference } from '../interface';
import { CatalogExplorerSessionState } from '../state';

import * as util from '../util';

// base class for Alexa Conversations API handlers
export abstract class BaseApiHandler implements RequestHandler {
    protected apiName : string;

    constructor(
        apiName: string
    ) {
        this.apiName = apiName;
    }

    canHandle(handlerInput : HandlerInput): boolean {
        return util.isApiRequest(handlerInput, this.apiName);
    }

    abstract handle(handlerInput : HandlerInput): Response;

    // returns activeCatalog from session, when session is used instead of focus or
    // when there is no active catalog reference provided in the arguments
    getActiveCatalog(handlerInput : HandlerInput, catalogRef: CatalogReference | undefined): CatalogReference{
        if (CatalogExplorer.useSessionArgs || catalogRef === undefined){
            const sessionState = CatalogExplorerSessionState.load(handlerInput);
            return sessionState.activeCatalog;
        }
        else{
            return catalogRef;
        }
    }
}