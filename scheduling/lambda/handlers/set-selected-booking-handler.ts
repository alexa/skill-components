// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { ListNav } from '@alexa-skill-components/list-navigation';
import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

import { apiNamespace } from '../config';
import { SchedulingComponent } from '../interface';
import { SchedulingComponentSessionState } from '../state';

import { BaseApiHandler } from './base-api-handler';

export class SetSelectedBookingHandler extends BaseApiHandler {
    static defaultApiName = `${apiNamespace}.show.setSelectedBooking`;

    constructor(
        apiName: string = SetSelectedBookingHandler.defaultApiName
    ) {
        super(apiName);
    }

    handle(handlerInput: HandlerInput): Response {
        const selectedItem = ListNav.getSelectedItem(handlerInput);

        if (SchedulingComponent.useSessionArgs){
            const sessionState = SchedulingComponentSessionState.load(handlerInput);
            sessionState.argsState!.schedulingInfo = selectedItem;
            sessionState.save(handlerInput);
        }

        return handlerInput.responseBuilder
            .withApiResponse({})
            .withShouldEndSession(false)
            .getResponse();
    }
}
