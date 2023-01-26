// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

import { apiNamespace } from '../config';
import { CatalogReference, CatalogExplorer } from '../interface';
import { Page, CatalogProvider, RecommendationResult} from "../catalog-provider";
import { CatalogExplorerSessionState, PageTokens } from '../state';
import * as util from '../util';
import { BaseApiHandler } from './base-api-handler';

interface Arguments{
    // reference to catalog being navigated
    catalogRef: CatalogReference;

    // properties and their values on the basis of which search will be performed
    searchConditions: any;

    // the page to retrieve an item from
    page: Page<any>;

    // the index of the item in the page to retrieve (starts at 1)
    index: number;
}

// called to retrieve a specific item from a given page, will pull current page out of 
// the session state instead of relying on the passed in arguments if CatalogExplorer.useSessionArgs 
// is true
export class SelectItemHandler extends BaseApiHandler {
    static defaultApiName = `${apiNamespace}.selectItem`;

    constructor(
        apiName: string = SelectItemHandler.defaultApiName
    ) {
        super(apiName);
    }

    handle(handlerInput : HandlerInput): Response {
        const args = util.getApiArguments(handlerInput) as Arguments;

        let recommendationResult : RecommendationResult<any,any>;
        const catalogRef = super.getActiveCatalog(handlerInput, args.catalogRef);

        if(CatalogExplorer.useSessionArgs){
            recommendationResult = this.getNewRecommendationResultFromSession(handlerInput, args, catalogRef);
        }
        else{
            const currentRecommendationsPage = args.page;
            const sessionState = CatalogExplorerSessionState.load(handlerInput);
            const providerState = sessionState.providerState;
            const catalogProvider: CatalogProvider<any,any> = CatalogExplorer.getProvider(catalogRef, providerState);
            if (!this.handleIndex(currentRecommendationsPage.itemCount, args.index)){
                // if index is out of bound throw an error
                throw new Error("Index out of bound");
            }
            recommendationResult = catalogProvider.selectItem(currentRecommendationsPage, args.index-1);
            recommendationResult.searchConditions = args.searchConditions;
        }
        //converting rescoped boolean to number, as ACDL does not support boolean datatype
        const modifiedRecommendationResult = util.modifyRecommendationResultRescoped(recommendationResult);

        return handlerInput.responseBuilder
            .withApiResponse(modifiedRecommendationResult)
            .withShouldEndSession(false)
            .getResponse();
    }

    getNewRecommendationResultFromSession(handlerInput: HandlerInput, args: Arguments, catalogRef: CatalogReference): RecommendationResult<any,any>{
        const sessionState = CatalogExplorerSessionState.load(handlerInput);

        let index = args.index;
        const providerState = sessionState.providerState;
        const catalogProvider: CatalogProvider<any,any> = CatalogExplorer.getProvider(catalogRef, providerState);

        // get arguments from session state
        const recommendationResultFromSession =  sessionState.argsState?.recommendationResult;
        const searchConditionsFromSession = sessionState.argsState?.searchConditions;
        
        if (recommendationResultFromSession === undefined){
            throw new Error("Recommendation Result from session state in undefined");
        }

        const pageFromSession = recommendationResultFromSession.recommendations;

        if (!this.handleIndex(pageFromSession.itemCount, index)){
            // if index is out of bound throw an error
            throw new Error("Index out of bound");
        }

        const newRecommendationResult = catalogProvider.selectItem(pageFromSession, index-1);
        newRecommendationResult.searchConditions = searchConditionsFromSession;
        
        // updating session state arguments
        sessionState.providerState = catalogProvider.serialize();
        sessionState.argsState!.recommendationResult = newRecommendationResult;
        sessionState.argsState!.currentPageSize = 1;  // to enable item by item pagination
        sessionState.argsState!.currentPageTokens = {
            prevPageToken: newRecommendationResult.recommendations.prevPageToken,
            currentPageToken: undefined,
            nextPageToken: newRecommendationResult.recommendations.nextPageToken
        } as PageTokens;
        sessionState.argsState!.proactiveOffer = newRecommendationResult.offer;
        sessionState.save(handlerInput);

        return newRecommendationResult;
    }

    handleIndex(itemCount: number, index: number): boolean{
        if (itemCount < index){
            return false
        }
        return true;
    }
}