// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

import { apiNamespace } from '../config';
import * as util from '../util';
import { BaseApiHandler } from './base-api-handler';
import { CatalogExplorerSessionState } from '../state';

// simple action to convert a relativePosition (top, middle, last) into a index (1, 2, 3)
// Note: needed as ACDL doesn't have this support built in
export class ConvertRelativePositionToIndexHandler extends BaseApiHandler {
    static defaultApiName = `${apiNamespace}.navigate.convertRelativePositionToIndex`;

    constructor(
        apiName: string = ConvertRelativePositionToIndexHandler.defaultApiName
    ) {
        super(apiName);
    }

    handle(handlerInput : HandlerInput): Response {
        const args = util.getApiArguments(handlerInput)



        const sessionState = CatalogExplorerSessionState.load(handlerInput);
        const currPageSize = sessionState.argsState?.currentPageSize || 1;

        const relativePosition = args.relativePosition;

        const index = this.getIndexFromRelativePosition(relativePosition, currPageSize);

        console.log("Relative Position index: ",index);
        return handlerInput.responseBuilder
            .withApiResponse(index)
            .withShouldEndSession(false)
            .getResponse();
    }

    // converting relativePosition to index
    getIndexFromRelativePosition(relativePosition: string, pageSize: number): number{

        //define values for relative position here
        const left = ['top','left'];
        const middle = ['middle'];
        const right = ['last','bottom','right'];

        //relativePositionValues object
        let relativePositionValues: Record<string, Set<string>> = {
            "left": new Set(left),
            "middle": new Set(middle),
            "right": new Set(right)
        };

        switch (true) {
            case relativePositionValues["left"].has(relativePosition):
                return 1;
            case relativePositionValues["middle"].has(relativePosition):
                return Math.ceil(pageSize/2);
            case relativePositionValues["right"].has(relativePosition):
                return pageSize;
            default:
                throw new Error(`Relative Position not supported: ${relativePosition}`);
        }
    }
}
