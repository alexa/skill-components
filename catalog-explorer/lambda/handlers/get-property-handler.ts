// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

import { apiNamespace } from '../config';
import { CatalogReference, CatalogExplorer } from '../interface';
import { CatalogProvider, ProactiveOffer} from "../catalog-provider";
import { CatalogExplorerSessionState } from '../state';
import * as util from '../util';
import { BaseApiHandler } from './base-api-handler';

export interface PropertyValueResult{
    value: string;
    propertyName: string;
    offer?: ProactiveOffer;
    items?: any[];
}

interface Arguments{
    // reference to the catalog
    catalogRef: CatalogReference;   

    // an array containing only the selected item,
    // as array indexing does not work properly with ACDL currently
    items: any[];
}

// called to get the details for a given property name for the current selected item.
// Will pull selected item out of the session state instead of arguments passed 
// in API call if CatalogExplorer.useSession is true
export class GetPropertyHandler extends BaseApiHandler {
    static defaultApiPrefixName = `${apiNamespace}.getProperty_`;

    constructor(
        apiName: string = GetPropertyHandler.defaultApiPrefixName
    ) {
        super(apiName);
    }

    canHandle(handlerInput : HandlerInput): boolean {
        return util.isApiRequestPrefix(handlerInput, this.apiName);
    }

    handle(handlerInput : HandlerInput): Response {
        const args = util.getApiArguments(handlerInput) as Arguments;

        const propertyName = this.getPropertyNameFromApi(handlerInput);
        
        if (propertyName === null || propertyName === ""){
            throw new Error("Property Name cannot be fetched from API");
        }

        let propertyValueResult : PropertyValueResult;
        const catalogRef = super.getActiveCatalog(handlerInput, args.catalogRef);

        if (CatalogExplorer.useSession) {
            propertyValueResult = GetPropertyHandler.getPropertyValueResultFromSession<Arguments>(handlerInput, args, propertyName, catalogRef);
        }
        else {
            const catalogProvider: CatalogProvider<any,any> = CatalogExplorer.getProvider(handlerInput,catalogRef);
            const propertyResult = catalogProvider.getProperty(args.items[0], propertyName);
            propertyValueResult = {
                value: propertyResult.value,
                propertyName: propertyName,
                offer: propertyResult.offer,
                items: args.items
            }
        }

        return handlerInput.responseBuilder
            .withApiResponse(propertyValueResult)
            .withShouldEndSession(false)
            .getResponse();
    }

    static getPropertyValueResultFromSession<Arguments>(handlerInput: HandlerInput, args: Arguments, propertyName: string, catalogRef: CatalogReference): PropertyValueResult{
        const sessionState = CatalogExplorerSessionState.load(handlerInput);

        const catalogProvider: CatalogProvider<any, any> = CatalogExplorer.getProvider(handlerInput,catalogRef);

        // get selectedItem from the recommendationResult stored in session state.
        // ideally only one item should be present in recommendations page before calling getProperty API
        const selectedItem = sessionState.argsState.recommendationResult?.recommendations.items[0];
        
        const propertyResult = catalogProvider.getProperty(selectedItem, propertyName);

        // updating session state arguments
        sessionState.argsState.proactiveOffer = propertyResult.offer;
        sessionState.save(handlerInput);
        
        return {
            value: propertyResult.value,
            propertyName: propertyName,
            offer: propertyResult.offer,
            items: sessionState.argsState.recommendationResult?.recommendations.items
        } as PropertyValueResult;
    }

    getPropertyNameFromApi(handlerInput : HandlerInput): string | null{
        const apiName: string | undefined = util.getAPIName(handlerInput); //getProperty_{propertyName}
        if (apiName === undefined) {
            return null;
        }
        const propertyName: string | undefined = apiName.split("_").pop();
        if (propertyName === undefined) {
            return null;
        }
        return propertyName;
    }
}