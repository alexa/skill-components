// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

import { apiNamespace } from '../config';
import { CatalogReference, CatalogExplorer } from '../interface';
import { CatalogProvider, PagingDirection, RecommendationResult} from "../catalog-provider";
import { CatalogExplorerSessionState, PageTokens } from '../state';
import * as util from '../util';
import { BaseApiHandler } from './base-api-handler';

interface Arguments {
    // reference to catalog
    catalogRef: CatalogReference;

    // properties and their values on the basis of which search will be performed
    searchConditions: any;

    // indicates the page to retrieve
    pageToken: string;
}

// called to get a specific page from the catalog being navigated with (identified by a given
// page token). Will rely on data stored in session state instead of arguments passed 
// in API call if CatalogExplorer.useSessionArgs is true
export class GetPageHandler extends BaseApiHandler{
    static defaultApiName = `${apiNamespace}.getPage`;

    constructor(
        apiName: string = GetPageHandler.defaultApiName
    ) {
        super(apiName);
    }

    async handle(handlerInput: HandlerInput): Promise<Response> {
        const args = util.getApiArguments(handlerInput) as Arguments;
        
        let recommendationResult: RecommendationResult<any,any> | Promise< RecommendationResult<any,any>>;
        const catalogRef = super.getActiveCatalog(handlerInput, args.catalogRef);

        if (CatalogExplorer.useSessionArgs){
            recommendationResult = this.getNewRecommendationResultFromSession(handlerInput, args, catalogRef);
        }
        else{
            const sessionState = CatalogExplorerSessionState.load(handlerInput);
            const providerState = sessionState.providerState;
            const catalogProvider: CatalogProvider<any,any> = CatalogExplorer.getProvider(catalogRef, providerState);
            // needs to be refactored for pagingDirection and current page size, once support for generics on actions is added
            const pagingDirection = PagingDirection.NEXT;
            recommendationResult = catalogProvider.getRecommendationsPage(args.searchConditions, catalogRef.pageSize, args.pageToken, pagingDirection);
            
        }
        recommendationResult = await Promise.resolve(recommendationResult)
        //converting rescoped boolean to number, as ACDL does not support boolean datatype
        const modifiedRecommendationResult = util.modifyRecommendationResultRescoped(recommendationResult);

        return handlerInput.responseBuilder
            .withApiResponse(modifiedRecommendationResult)
            .withShouldEndSession(false)
            .getResponse();
    }

    async getNewRecommendationResultFromSession(handlerInput: HandlerInput, args: Arguments, catalogRef: CatalogReference): Promise<RecommendationResult<any,any>>{
        const sessionState = CatalogExplorerSessionState.load(handlerInput);
        const providerState = sessionState.providerState;

        const catalogProvider: CatalogProvider<any, any> = CatalogExplorer.getProvider(catalogRef, providerState);
        // get arguments from session state
        const pageToken = sessionState.argsState?.upcomingPageToken;
        const searchConditions = sessionState.argsState?.searchConditions;
        const currPageSize = sessionState.argsState?.currentPageSize;
        const pagingDirection = sessionState.argsState?.pagingDirection;

        if (pagingDirection === undefined) {
            throw new Error("Paging Direction not present in session")
        }
        let recommendationResult = catalogProvider.getRecommendationsPage(searchConditions,currPageSize!, pageToken, pagingDirection);
        recommendationResult = await Promise.resolve(recommendationResult)
        // updating session state arguments
        sessionState.providerState = catalogProvider.serialize();
        sessionState.argsState!.currentPageTokens = {
            prevPageToken: recommendationResult.recommendations.prevPageToken,
            currentPageToken: pageToken,
            nextPageToken: recommendationResult.recommendations.nextPageToken
        } as PageTokens;
        sessionState.argsState!.recommendationResult = recommendationResult;
        sessionState.argsState!.searchConditions = recommendationResult.searchConditions;
        sessionState.argsState!.upcomingPageToken = undefined; // will be set again before next call to getPage API
        sessionState.argsState!.proactiveOffer = recommendationResult.offer;
        sessionState.save(handlerInput);

        return recommendationResult;
    }
}