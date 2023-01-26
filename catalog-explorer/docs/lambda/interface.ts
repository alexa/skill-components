// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { v4 as uuidv4 } from 'uuid';
import { CatalogProviderRegistry, CatalogProvider } from "./catalog-provider";

import { ArgumentsState, CatalogExplorerSessionState } from "./state";

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

    // name of the catalog provider type and state data required by the catalog provider;
    // used to reconstruct catalog provider instance
    catalogProviderName: string;
    state: any;

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
    static useSessionArgs: boolean = true;

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
            state: catalogProvider.serialize(),
            pageSize: pageSize
        } as CatalogReference;

        // state data required by the catalog provider is stored;
        // used to reconstruct catalog provider instance
        const providerState = catalogProvider.serialize();

        if (this.useSessionArgs){
            const argsState: ArgumentsState<any,any> = {}
            // construct new session state instance, where arguments will be stored in session and used
            const newState = new CatalogExplorerSessionState({ activeCatalog: catalogRef, providerState, argsState });
            newState.save(handlerInput);
        }
        else{
            // construct new session state instance, where no arguments will be stored in session
            const newState = new CatalogExplorerSessionState({ activeCatalog: catalogRef, providerState });
            newState.save(handlerInput);
        }
        
        return catalogRef;
    }

    //enables the skill developer to explicitly set the active CatalogReference into the session, even when useSessionArgs is false
    static setActiveCatalog(handlerInput: HandlerInput, catalogRef: CatalogReference) : void {
        const initialProviderState = catalogRef.state;
        if (this.useSessionArgs){
            const argsState: ArgumentsState<any,any> = {}
            const newState = new CatalogExplorerSessionState({ activeCatalog: catalogRef, providerState: initialProviderState, argsState });
            newState.save(handlerInput);
        }
        else{
            const newState = new CatalogExplorerSessionState({ activeCatalog: catalogRef, providerState: initialProviderState});
            newState.save(handlerInput);
        }
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
    static getProvider(catalogRef: CatalogReference, providerState?:any): CatalogProvider<any,any> {
        const deserializer = CatalogProviderRegistry.getDeserializer(catalogRef.catalogProviderName);

        if (deserializer == undefined) {
            throw new Error(`No catalog provider registered for ${catalogRef.catalogProviderName}`);
        }
        if (providerState == undefined){
            return deserializer(catalogRef.state);
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