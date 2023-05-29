// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput, RequestHandler } from 'ask-sdk-core';

import { Utils } from '@alexa-skill-components/list-navigation';

import { skillDomain } from '../skill-config';

export class ContinueSessionHandler implements RequestHandler {
    canHandle(handlerInput : HandlerInput) : boolean {
        return Utils.isApiRequest(handlerInput, `${skillDomain}.continueSession`);
	}

    handle(handlerInput: HandlerInput) {
        
        return handlerInput.responseBuilder
            .withApiResponse({})
            .withShouldEndSession(false)
            .getResponse();
    }
}