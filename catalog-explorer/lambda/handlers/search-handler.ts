// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";

import { apiNamespace } from '../config';
import { CatalogExplorer } from '../interface';
import { CatalogProvider, RecommendationResult } from "../catalog-provider";
import { CatalogExplorerSessionState, PageTokens } from '../state';
import * as util from '../util';
import { BaseApiHandler } from './base-api-handler';

// called to perform a new or refined search in the catalog, based on the given search conditions
export class SearchHandler extends BaseApiHandler {
    static defaultApiPrefixName = `${apiNamespace}.search_`;

    constructor(
        apiName: string = SearchHandler.defaultApiPrefixName
    ) {
        super(apiName);
    }

    canHandle(handlerInput: HandlerInput): boolean {
        return util.isApiRequestPrefix(handlerInput, this.apiName);
    }

    async handle(handlerInput : HandlerInput): Promise<Response >{
        const args = util.getApiArguments(handlerInput) as any;
        const searchType = this.getSearchTypeFromAPI(handlerInput);
        let recommendationResult : RecommendationResult<any,any> | Promise<RecommendationResult<any,any>>;
        if (searchType === "new" || searchType == "refine"){
            recommendationResult = await Promise.resolve(this.newSearchSession(handlerInput,searchType));
        }
        else {
            throw new Error("Search Type fetched from API is incorrect");
        }
        //converting rescoped boolean to number, as ACDL does not support boolean datatype
        const modifiedRecommendationResult = util.modifyRecommendationResultRescoped(recommendationResult);

        return handlerInput.responseBuilder
            .withApiResponse(modifiedRecommendationResult)
            .withShouldEndSession(false)
            .getResponse();
    }

    async newSearchSession(handlerInput: HandlerInput, searchType : string): Promise<RecommendationResult<any,any>>{
        const sessionState = CatalogExplorerSessionState.load(handlerInput);
      
        // get catalog reference out of session, instead of arguments
        const catalogRef = sessionState.activeCatalog;
        const providerState = sessionState.providerState;
        const catalogProvider: CatalogProvider<any, any> = CatalogExplorer.getProvider(catalogRef, providerState);

        // get search conditions from arguments
        let newSearchConditions = util.getResolvedApiSlotValues(handlerInput);

        // discarding catalog reference, in case it is present in the arguments
        delete newSearchConditions["catalogRef"];

        if (searchType === "refine") {
            const searchConditionsFromSession = sessionState.argsState?.searchConditions;
            const refinedSearchConditions = { ...searchConditionsFromSession, ...newSearchConditions };
            newSearchConditions = refinedSearchConditions;
        }
        const recommendationResult = await Promise.resolve(catalogProvider.performSearch(newSearchConditions, catalogRef.pageSize));

        // updating session state arguments
        sessionState.providerState = catalogProvider.serialize();
        sessionState.argsState!.recommendationResult = recommendationResult;
        sessionState.argsState!.searchConditions = recommendationResult.searchConditions;
        sessionState.argsState!.currentPageSize = catalogRef.pageSize;  // reset currentPageSize after a search has been performed
        sessionState.argsState!.currentPageTokens = {
            prevPageToken: recommendationResult.recommendations.prevPageToken,
            currentPageToken: undefined,
            nextPageToken: recommendationResult.recommendations.nextPageToken
        } as PageTokens;
        sessionState.argsState!.proactiveOffer = recommendationResult.offer;
        sessionState.save(handlerInput);

        return recommendationResult;
    }

    getSearchTypeFromAPI(handlerInput: HandlerInput): string | null {
        const apiName: string | undefined = util.getAPIName(handlerInput); //search_{new/refine}
        if (apiName === undefined) {
            return null;
        }
        const searchType: string | undefined = apiName.split("_").pop();
        if (searchType === undefined || searchType === "") {
            return null;
        }
        return searchType;
    }
}