// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { ListNav, ListNavSessionState, ListReference, Page } from '@alexa-skill-components/list-navigation';
import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

import { apiNamespace } from '../config';
import { SchedulingComponent } from '../interface';
import { SchedulingComponentSessionState } from '../state';

import * as util from '../util';
import { BaseApiHandler } from './base-api-handler';

interface Arguments {
    // reference to list being navigated
    listRef: ListReference;

    // the page to retrieve an item from
    page: Page<any>;

    // the index of the item in the page to retrieve (starts at 1)
    index: number;
}

// called to retrieve a specific item from a given page, will pull current page out of 
// the session state instead of relying on the passed in arguments if ListNav.useSessionArgs 
// is true
// 
// Note: needed to work around ACDL issues with indexing into a list and to ensure all 
// navigation samples end in a single API to make follow-up responses possible
export class SelectBookingHandler extends BaseApiHandler {
    static defaultApiName = `${apiNamespace}.selectBooking`;

    constructor(
        apiName: string = SelectBookingHandler.defaultApiName
    ) {
        super(apiName);
    }

    async handle(handlerInput: HandlerInput): Promise<Response> {
        const args = util.getApiArguments(handlerInput) as Arguments;

        let currentPage: Page<any>;

        if (ListNav.useSessionArgs) {
            const listNavSessionState = ListNavSessionState.load(handlerInput);
            currentPage = await listNavSessionState.getCurrentPage();
            listNavSessionState.validateArguments(args.listRef, args.page.pageToken);
        }
        else {
            currentPage = args.page;
        }

        const selectedBooking = currentPage.items[args.index - 1];

        if (SchedulingComponent.useSessionArgs) {
            const sessionState = SchedulingComponentSessionState.load(handlerInput);
            sessionState.argsState!.schedulingInfo = selectedBooking;
            sessionState.save(handlerInput);
        }

        return handlerInput.responseBuilder
            .withApiResponse(selectedBooking)

            // this is the last API called in all dialog flows generated by the list nav component,
            // but the component does not know whether the skill dev wants the session to end
            // after a call to the list nav component, so we need to assume they do not wish
            // the session to end and leave it up to the skill to end the session or not
            // 
            // Note: the current run-time behavior is to re-prompt on all responses where the prior API
            //       returns shouldEndSession=false (even for simply Notify responses), so the skill
            //       will need to utilize a API (like the provided endSession util action) to end
            //       the session if desired
            // Note: once support for passing static values into API calls is added to ACDL, then
            //       the list-nav component could take a "shouldEndSession" flag as input in the ACDL
            //       to more easily allow the developer to work-around this issue
            .withShouldEndSession(false)

            .getResponse();
    }
}
