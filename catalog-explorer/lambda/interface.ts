// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { v4 as uuidv4 } from 'uuid';
import { CatalogProviderRegistry, CatalogProvider } from "./catalog-provider";

import { ArgumentsState, CatalogExplorerSessionState, ProviderState } from "./state";

import {
    AcceptOfferHandler,
    ConvertOrdinalToIndexHandler,
    GetPageHandler,
    GetPropertyHandler,
    PerformActionHandler,
    SearchHandler,
    SelectItemHandler,
    RecordInitialEventHandler,
    RecordNextEventHandler,
    RecordPrevEventHandler
} from "./handlers";

// reference to a catalog that can be explored; abstract type used over just a catalog
// object to allow for dyanmic catalog providers in the API side (possibly mapping
// on to a catalog source of unknown size like a DDB table)
export interface CatalogReference {
    // unique id for the catalog; random UUID generated 
    // when catalog reference is generated
    id: string;

    // name of the catalog provider type
    catalogProviderName: string;

    // number of items in each page
    pageSize: number
}

// Main static interface to catalog explorer component on API side
export class CatalogExplorer {
    // whether to rely on session (instead of API arguments) to pass data between turns (CatalogReference, providerState,
    // , pageTokens etc)
    // Note: this can be used to work around issues with incorrect/unexpected data being passed into API calls
    //       between turns in some navigation interactions and use cases; will no longer be needed if data
    //       passing issues can be resolved
    static useSession: boolean = true;

    // build a catalog reference instance for a given catalog provider instance
    //
    // Arguments:
    //     handlerInput: HandlerInput instance for the current API request, needed to store state into current
    //                   session
    //     catalogProvider: CatalogProvider instance for the catalog to build a reference for
    //     pageSize:     Number of items that should be in each page when navigating through catalog
    //
    // Returns: constrcuted catalog reference instance
    static buildCatalogReference(
        handlerInput: HandlerInput,
        catalogProvider: CatalogProvider<any, any>,
        pageSize: number = 3
    ): CatalogReference {

        const catalogRef = {
            id: uuidv4(),
            catalogProviderName: catalogProvider.getName(),
            pageSize: pageSize
        } as CatalogReference;

        // state data required by the catalog provider is stored;
        // used to reconstruct catalog provider instance
        const providerState: ProviderState = {};
        providerState[catalogRef.id] = catalogProvider.serialize();

        const argsState: ArgumentsState<any,any> = {
            currentPageSize: pageSize
        }

        // construct new session state instance (assuming this catalog is the new active catalog) and store in session
        const newState = new CatalogExplorerSessionState({ activeCatalog: catalogRef, providerState: providerState, argsState: argsState });
        newState.save(handlerInput);
        
        return catalogRef;
    }

    static isActiveCatalogSet(handlerInput: HandlerInput): boolean{
        const sessionState = CatalogExplorerSessionState.getPlainSessionState(handlerInput);
        if(sessionState && sessionState.activeCatalog){
            return true;
        }
        return false;
    }
    
    // get the catalog provider instance for a catalog reference; reconstructs the catalog provider instance from
    // serialized state in the providerState
    //
    // Arguments:
    //     handlerInput: HandlerInput instance for the current API request
    //     catalogRef: reference to get the provider for
    //
    // Returns: the reconstructed catalog provider instance
    //
    static getProvider(handlerInput: HandlerInput, catalogRef: CatalogReference): CatalogProvider<any,any> {
        const sessionState = CatalogExplorerSessionState.load(handlerInput);
        const deserializer = CatalogProviderRegistry.getDeserializer(catalogRef.catalogProviderName);
        const providerState = sessionState.providerState[catalogRef.id];

        if (deserializer == undefined) {
            throw new Error(`No catalog provider registered for ${catalogRef.catalogProviderName}`);
        }
        return deserializer(providerState);
    }
    // creates all Alexa RequestHandler instances that need to be registered in a skill's API endpoint
    // for catalog explorer component to work correctly.
    //
    // Arguments:
    //     getPageApiName:     fully qualified name (FQN, including namespace) of the getPageApi
    //                         passed into buildNavigationConfig in ACDL
    //     selectItemApiName:  FQN of the selectItemApi passed into buildNavigationConfig in ACDL
    //     searchApiName:      FQN of the searchApi passed into buildNavigationConfig in ACDL
    //     getPropertyApiName: FQN of the getPropertyApi passed into buildNavigationConfig in ACDL
    //     performActionApi:   FQN of the performActionApi passed into buildNavigationConfig in ACDL
    //     acceptOfferApiName: FQN of the acceptOfferApi passed into buildNavigationConfig in ACDL
    //
    // Returns: array of constructed handlers
    static createHandlers(
        getPageApiName: string,
        selectItemApiName: string,
        searchApiName: string,
        getPropertyApiName: string,
        performActionApiName: string,
        acceptOfferApiName: string,
    ): RequestHandler[] {
        return [
            // util handlers
            new ConvertOrdinalToIndexHandler(),

            // record-event handlers
            new RecordInitialEventHandler(),
            new RecordNextEventHandler(),
            new RecordPrevEventHandler(),

            // APIs that have to be defined by skill dev (as they use generics)
            new SearchHandler(searchApiName),
            new GetPageHandler(getPageApiName),
            new SelectItemHandler(selectItemApiName),
            new AcceptOfferHandler(acceptOfferApiName),
            new GetPropertyHandler(getPropertyApiName),
            new PerformActionHandler(performActionApiName),
        ];
    }
}