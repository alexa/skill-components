// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { PageToken, PagingDirection, ProactiveOffer, RecommendationResult } from "./catalog-provider";

import { CatalogReference } from './interface';

// key in session where all the catalog explorer session start will be stored
const sessionKey = "_ac_catalogExplorer";

// collection of just the tokens from a page object; used to avoid storing 
// entire list of page items in the session
export interface PageTokens {
    prevPageToken?: PageToken;
    currentPageToken?: PageToken;
    nextPageToken?: PageToken;
}

// representation of raw state data stored in the session
interface PlainSessionState<SearchConditions, Item> {
    activeCatalog: CatalogReference;
    providerState: any;
    argsState?: ArgumentsState<SearchConditions, Item>
}

// State arguments stored into the session that will be used instead of relying on arguments passed into 
// APIs if CatalogExplorer.useSessionArgs is true
//
// Note: simply used to work around issues with passing data in API arguments between turns in some 
// catalog explorer scenarios, can be removed once data passing via API arguments is fixed
export interface ArgumentsState<SearchConditions, Item>{
    // current number of items in each page, updated by selectItem API 
    // to enable item by item pagination, reset by performSearch API
    currentPageSize?: number;

    // current offer being provided to the user; set by performSearch, getPage,
    // selectItem and getProperty APIs
    proactiveOffer?: ProactiveOffer;

    // current page being shown for the active catalog; set by performSearch, getPage and selectItem APIs;
    // used by record-event APIs called before getPage instead of relying on the page token
    // passed via API arguments
    currentPageTokens?: PageTokens;

    // page token that should be passed into the next getPage API call; set by record-event APIs
    // called before getPage (based on the currentPage below, if it exists); used by getPage API
    // instead of the page token passed via API arguments
    upcomingPageToken?: PageToken;

    // current search conditions; set by performSearch API; used by getPage API
    searchConditions?: SearchConditions;

    // current recommendationResult; set by performSearch, getPage and selectItem APIs;
    // used by selectItem, getProperty and performAction APIs
    recommendationResult?: RecommendationResult<SearchConditions, Item>;
    
    // current paging direction; set by record-event APIs; used by getPage API
    pagingDirection?: PagingDirection;

}

// State stored into the session
export class CatalogExplorerSessionState<SearchConditions, Item>  {

    // the catalog currently being explored; set when a new catalog reference is built; used by 
    // acceptOffer, performSearch, getPage, selectItem, getProperty and performAction APIs 
    // instead of relying on catalog reference passed via API arguments
    activeCatalog: CatalogReference;
    
    // state data required by the catalog provider;
    // used to reconstruct catalog provider instance
    providerState: any;
    
    // arguments stored into the session
    argsState?: ArgumentsState<SearchConditions, Item>;

    constructor(plainState: PlainSessionState<SearchConditions, Item>) {
        this.activeCatalog = plainState.activeCatalog;
        this.providerState = plainState.providerState;
        this.argsState = plainState.argsState;
    }

    private serialize(): PlainSessionState<SearchConditions, Item> {
        return {
            activeCatalog: this.activeCatalog,
            providerState: this.providerState,
            argsState: this.argsState
        } as PlainSessionState<SearchConditions, Item>;
    }

    // save this session state into the current skill session
    save(handlerInput: HandlerInput): void {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const plainState = this.serialize();
        sessionAttributes[sessionKey] = plainState;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        console.log(`CatalogExplorerSessionState: saved new state: ${JSON.stringify(plainState)}`);
    }

    // clear catalog explorer session state stored in current skill session
    static clear(handlerInput: HandlerInput): void {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        delete sessionAttributes[sessionKey];
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    }

    // load the catalog explorer session state stored in current skill session;
    // will throw a error if no session state is currently stored
    static load(handlerInput: HandlerInput): CatalogExplorerSessionState<any, any> {
        const plainState = this.getPlainSessionState(handlerInput);
        if (plainState == undefined || plainState.activeCatalog == undefined) {
            throw new Error("No catalog nav state present in session, please setup catalog nav state prior to " +
                "using component by calling CatalogExplorer.buildCatalogReference()");
        }
        console.log(`CatalogExplorerSessionState: loaded catalog nav session state: ${JSON.stringify(plainState)}`);
        return new CatalogExplorerSessionState(plainState);
    }

    static getPlainSessionState(handlerInput: HandlerInput) : PlainSessionState<any, any> | undefined {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const plainState: PlainSessionState<any, any> | undefined = sessionAttributes[sessionKey];
        return plainState;
    }
}