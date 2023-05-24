// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

import { apiNamespace } from '../config';
import { SchedulingComponent } from '../interface';
import { SchedulingProvider, SchedulingResult } from '../provider';
import { SchedulingComponentSessionState } from '../state';
import * as util from '../util';
import { BaseApiHandler } from './base-api-handler';

export class CancelHandler extends BaseApiHandler {
    static defaultApiPrefixName = `${apiNamespace}.schedule`;

    constructor(
        apiName: string = CancelHandler.defaultApiPrefixName
    ) {
        super(apiName);
    }

    async handle(handlerInput: HandlerInput): Promise<Response> {
        let schedulingInfo = util.getResolvedApiSlotValues(handlerInput);
        let result: SchedulingResult;

        const sessionState = SchedulingComponentSessionState.load(handlerInput);

        // get scheduling reference and provider state out of session
        const schedulingRef = sessionState.activeRef;
        const providerState = sessionState.providerState;
        const schedulingProvider: SchedulingProvider<any> = SchedulingComponent.getProvider(schedulingRef, providerState);

        if (SchedulingComponent.useSessionArgs) {
            const schedulingInfoFromSession = sessionState.argsState?.schedulingInfo;
            result = await Promise.resolve(schedulingProvider.cancel(schedulingInfoFromSession));
        }
        else {
            result = await Promise.resolve(schedulingProvider.cancel(schedulingInfo));
        }

        const modifiedResult = util.modifySchedulingResultSuccess(result);

        return handlerInput.responseBuilder
            .withApiResponse(modifiedResult)
            .withShouldEndSession(false)
            .getResponse();
    }
}