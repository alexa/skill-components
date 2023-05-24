// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

import { apiNamespace } from '../config';
import { BaseApiHandler } from './base-api-handler';

import { ListNav, ListProvider } from '@alexa-skill-components/list-navigation';
import { SchedulingComponentSessionState } from '../state';
import { SchedulingProvider } from '../provider';
import { SchedulingComponent } from '../interface';

// simple API to build and return a list reference for the test list of books, need this
// list reference in order to utilize the list navigation component
export class ShowBookingsHandler extends BaseApiHandler {
    static defaultApiPrefixName = `${apiNamespace}.showBookings`;

    constructor(
        apiName: string = ShowBookingsHandler.defaultApiPrefixName
    ) {
        super(apiName);
    }

    handle(handlerInput: HandlerInput): Response {
        let listProvider: ListProvider<any>;

        const sessionState = SchedulingComponentSessionState.load(handlerInput);

        // get scheduling reference out of session, instead of arguments
        const schedulingRef = sessionState.activeRef;
        const providerState = sessionState.providerState;
        const schedulingProvider: SchedulingProvider<any> = SchedulingComponent.getProvider(schedulingRef, providerState);

        listProvider = schedulingProvider.showBookingsListProvider();
        
        const listRef = ListNav.buildListReference(
            handlerInput,
            listProvider,
            schedulingRef.pageSize
        );

        return handlerInput.responseBuilder
            .withApiResponse(listRef)
            .withShouldEndSession(false)
            .getResponse();
    }
}