// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

import { apiNamespace } from '../config';
import { ListNav } from '../interface';
import { ListProvider, Page } from '../list-provider';
import { ListNavSessionState } from '../session-state';
import * as util from '../util';
import { BaseApiHandler } from './base-api-handler';

interface Arguments {
    // size of the list to generate a random index for
    listSize: number
}

// simple action to generate a random index between 1 and the list size provided (inclusive);
// will instead use current page stored in session to determine list size if ListNav.useSessionArgs
// is true
export class GenerateRandomIndexHandler extends BaseApiHandler {
    static defaultApiName = `${apiNamespace}.utils.generateRandomIndex`;

    constructor(
        apiName: string = GenerateRandomIndexHandler.defaultApiName
    ) {
        super(apiName);
    }

    async handle(handlerInput : HandlerInput): Promise<Response> {
        const args = util.getApiArguments(handlerInput) as Arguments

        let listSize: number;
        if (ListNav.useSessionArgs) {
            listSize = await  this.getListSizeFromSession(handlerInput, args);
        } else {
            listSize = args.listSize;
        }

        const index = Math.floor(Math.random() * listSize);

        return handlerInput.responseBuilder
            .withApiResponse(index+1) // index in ACDL currently starts at 1 to match ordinal
            .withShouldEndSession(false)
            .getResponse();
    }

    async getListSizeFromSession(handlerInput : HandlerInput, args: Arguments): Promise<number> {
        const sessionState = ListNavSessionState.load(handlerInput);
        const currentPage = await sessionState.getCurrentPage();
        const listSize = currentPage.items.length;

        // log any mismatch between arguments passed into this handler and the aguments that should
        // have been passed (assuming API arguments working correctly)
        if (args.listSize != listSize) {
            console.log(`GenerateRandomIndexHandler: List size API arg mismatch; expected: ${listSize}, " +
                "actual: ${args.listSize}`);
        }

        return listSize;
    }
}
