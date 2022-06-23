// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

import { apiNamespace } from '../config';
import * as util from '../util';
import { BaseApiHandler } from './base-api-handler';

// simple action to convert a ordinal (first, second, third) into a index (1, 2, 3)
// Note: needed as ACDL doesn't have this support built in
export class ConvertOrdinalToIndexHandler extends BaseApiHandler {
    static defaultApiName = `${apiNamespace}.utils.convertOrdinalToIndex`;

    constructor(
        apiName: string = ConvertOrdinalToIndexHandler.defaultApiName
    ) {
        super(apiName);
    }

    handle(handlerInput : HandlerInput): Response {
        const args = util.getApiArguments(handlerInput)

        // API call interface already has converted the ordinal to a number for us,
        // so we can just return the argument value to do conversion
        const index = args.ordinal;

        return handlerInput.responseBuilder
            .withApiResponse(index)
            .withShouldEndSession(false)
            .getResponse();
    }
}
