// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

import { apiNamespace } from '../config';
import * as util from '../util';
import { BaseApiHandler } from './base-api-handler';

// Special util API just to indicate that the session should end (after the up-coming response)
//
// Note: the current run-time behavior is to re-prompt on all responses where the prior API
//       returns shouldEndSession=false (which the list-nav component does as it doesn't
//       know whether a skill wishes to end a session or not), so the skill will need to 
//       utilize a API (like this one) to end the session if desired
// Note: once support for passing static values into API calls is added to ACDL, then
//       the list-nav component could take a "shouldEndSession" flag as input in the ACDL
//       dialog call above to more easily allow the developer to work-around this issue
// Note: Fixing the behavior of Notify+Bye response act would also allow the skill to directly
//       control the session ending by specifying the act in the follow-up response to 
//       navigation
export class EndSessionHandler extends BaseApiHandler {
    static defaultApiName = `${apiNamespace}.utils.endSession`;

    constructor(
        apiName: string = EndSessionHandler.defaultApiName
    ) {
        super(apiName);
    }

    handle(handlerInput : HandlerInput): Response {
        const args = util.getApiArguments(handlerInput)

        // no need to do anything other than return true for shouldEndSession flag
        return handlerInput.responseBuilder
            .withApiResponse({})
            .withShouldEndSession(true)
            .getResponse();
    }
}
