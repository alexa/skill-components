// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

import { apiNamespace } from '../config';
import { CatalogReference, CatalogExplorer } from '../interface';
import { ProactiveOffer, CatalogProvider } from "../catalog-provider";
import { GetPropertyHandler, PropertyValueResult } from './get-property-handler';
import { PerformActionHandler, CatalogActionResult } from './perform-action-handler';
import * as util from '../util';
import { BaseApiHandler } from './base-api-handler';
import { CatalogExplorerSessionState } from '../state';

interface CatalogOfferResult{
    offer: ProactiveOffer;
    propertyValue?:string;
    actionResult?:string;
}

interface Arguments{
    // reference to the catalog
    catalogRef: CatalogReference;   

    // indicates the selected item
    items: any;

    // propertyValue/actionName passed
    proactiveOffer: ProactiveOffer;
}

// called to return a property value or to perform an action based on the provided proactive offer.
// Will pull proactiveOffer out of the session state instead of arguments passed 
// in API call if CatalogExplorer.useSession is true
export class AcceptOfferHandler extends BaseApiHandler {
    static defaultApiPrefixName = `${apiNamespace}.acceptOffer`;

    constructor(
        apiName: string = AcceptOfferHandler.defaultApiPrefixName
    ) {
        super(apiName);
    }

    handle(handlerInput : HandlerInput): Response {
        const args = util.getApiArguments(handlerInput) as Arguments;

        let proactiveOffer: ProactiveOffer;
        const catalogRef = super.getActiveCatalog(handlerInput, args.catalogRef);

        if (CatalogExplorer.useSession){
            const sessionState = CatalogExplorerSessionState.load(handlerInput);
            proactiveOffer = sessionState.argsState.proactiveOffer as ProactiveOffer;
        }
        else{
            proactiveOffer = args.proactiveOffer;
        }

        let offerResponse: CatalogOfferResult;
        if(proactiveOffer.propertyName){
            const propertyName = proactiveOffer.propertyName;
            let propertyValueResult: PropertyValueResult ;

            if (CatalogExplorer.useSession) {
                propertyValueResult = GetPropertyHandler.getPropertyValueResultFromSession<Arguments>(handlerInput,args,propertyName,catalogRef);
            }
            else {
                const catalogProvider: CatalogProvider<any,any> = CatalogExplorer.getProvider(handlerInput, catalogRef);
                const propertyResult = catalogProvider.getProperty(args.items[0], propertyName);
                propertyValueResult = {
                    value: propertyResult.value,
                    propertyName: propertyName,
                    offer: propertyResult.offer
                }
            }
            offerResponse = {
                offer : args.proactiveOffer,
                propertyValue: propertyValueResult.value
            }

        }
        else if(proactiveOffer.actionName){
            const actionName = proactiveOffer.actionName;
            let actionResult: CatalogActionResult;

            if (CatalogExplorer.useSession) {
                actionResult = PerformActionHandler.getActionResultFromSession<Arguments>(handlerInput,args,actionName,catalogRef);
            }
            else {
                const catalogProvider: CatalogProvider<any,any> = CatalogExplorer.getProvider(handlerInput, catalogRef);
                const result = catalogProvider.performAction(args.items[0], actionName);
                actionResult = {
                    result: result,
                    actionName: actionName
                }
            }
            offerResponse = {
                offer : args.proactiveOffer,
                actionResult: actionResult.result
            }
        }
        else{
            throw new Error("Property/Action name cannot be fetched from proactive offer");
        }

        return handlerInput.responseBuilder
            .withApiResponse(offerResponse)
            .withShouldEndSession(false)
            .getResponse();
    }
}