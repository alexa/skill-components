// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

import { apiNamespace } from '../config';
import { CatalogReference, CatalogExplorer } from '../interface';
import { CatalogProvider } from "../catalog-provider";
import { CatalogExplorerSessionState } from '../state';
import * as util from '../util';
import { BaseApiHandler } from './base-api-handler';

export interface CatalogActionResult{
    result: string;
    actionName: string;
}

interface Arguments {
    // reference to catalog being navigated
    catalogRef: CatalogReference;

    // an array containing only the selected item,
    // as array indexing does not work properly with ACDL currently
    items: any[];
}

// called to perform an action for the current selected item.
// Will pull selected item out of the session state instead of arguments passed 
// in API call if CatalogExplorer.useSessionArgs is true
export class PerformActionHandler extends BaseApiHandler {
    static defaultApiPrefixName = `${apiNamespace}.performAction_`;

    constructor(
        apiName: string = PerformActionHandler.defaultApiPrefixName
    ) {
        super(apiName);
    }

    canHandle(handlerInput: HandlerInput): boolean {
        return util.isApiRequestPrefix(handlerInput, this.apiName);
    }

    handle(handlerInput: HandlerInput): Response {
        const args = util.getApiArguments(handlerInput) as Arguments;

        const actionName = this.getActionNameFromApi(handlerInput);

        if (actionName === null) {
            throw new Error("Action Name cannot be fetched from API");
        }

        let catalogActionResult: CatalogActionResult;
        const catalogRef = super.getActiveCatalog(handlerInput, args.catalogRef);

        if (CatalogExplorer.useSessionArgs) {
            catalogActionResult = PerformActionHandler.getActionResultFromSession<Arguments>(handlerInput, args, actionName, catalogRef);
        }
        else {
            const sessionState = CatalogExplorerSessionState.load(handlerInput);
            const providerState = sessionState.providerState;
            const catalogProvider: CatalogProvider<any,any> = CatalogExplorer.getProvider(catalogRef, providerState);
            const actionResult = catalogProvider.performAction(args.items[0], actionName);
            catalogActionResult = {
                result: actionResult,
                actionName: actionName
            }
        }

        return handlerInput.responseBuilder
            .withApiResponse(catalogActionResult)
            .withShouldEndSession(false)
            .getResponse();
    }

    static getActionResultFromSession<Arguments>(handlerInput: HandlerInput, args: Arguments, actionName: string, catalogRef: CatalogReference): CatalogActionResult {
        const sessionState = CatalogExplorerSessionState.load(handlerInput);
        const providerState = sessionState.providerState;
        const catalogProvider: CatalogProvider<any,any> = CatalogExplorer.getProvider(catalogRef, providerState);

        // get selectedItem from the recommendationResult stored in session state.
        // ideally only one item should be present in recommendations page before calling performAction API
        const selectedItem = sessionState.argsState?.recommendationResult?.recommendations.items[0];

        const actionResult = catalogProvider.performAction(selectedItem, actionName);

        return {
            result: actionResult,
            actionName: actionName
        } as CatalogActionResult;
    }

    getActionNameFromApi(handlerInput: HandlerInput): string | null {
        const apiName: string | undefined = util.getAPIName(handlerInput);//performAction_{actionName}
        if (apiName === undefined) {
            return null;
        }
        const actionName: string | undefined = apiName.split("_").pop();
        if (actionName === undefined || actionName === "") {
            return null;
        }
        return actionName;
    }
}