// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

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

    abstract handle(handlerInput : HandlerInput): Response | Promise<Response>;
}