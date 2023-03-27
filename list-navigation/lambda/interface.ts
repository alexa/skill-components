// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { v4 as uuidv4 } from 'uuid';

import { ListProvider, ListProviderRegistry } from "./list-provider";
import {
    ConvertOrdinalToIndexHandler,
    GenerateRandomIndexHandler,
    GetPageHandler,
    IndexOfByNameHandler,
    ItemNameMatcher,
    RecordInitialEventHandler,
    RecordNextEventHandler,
    RecordPrevEventHandler,
    SelectItemHandler
} from "./handlers";
import { ArgumentsState, ListNavSessionState } from "./session-state";

// reference to a list that can be navigated; abstract type used over just a List
// object to allow for dyanmic list providers in the API side (possibly mapping
// on to a list source of unknown size like a DDB table)
export interface ListReference {
    // unique id for the list; random UUID generated when list reference is 
    // generated
    id: string;

    // name of the list provider type and state data required by the list provider;
    // used to reconstruct list provider instance
    listProviderName: string;
    state: any;

    // number of items in each page
    pageSize: number;
}

// Main static interface to list navigation component on API side
export class ListNav {
    // whether to rely on session (instead of API arguments) to pass data between turns (ListReference and 
    // page token)
    // Note: this can be used to work around issues with incorrect/unexpected data being passed into API calls
    //       between turns in some navigation interactions and use cases; will no longer be needed if data
    //       passing issues can be resolved
    static useSessionArgs: boolean = true;

    // build a list reference instance for a given list provider instance
    //
    // Arguments:
    //     handlerInput: HandlerInput instance for the current API request, needed to store state into current
    //                   session
    //     listProvider: ListProvider instance for the list to build a reference for
    //     pageSize:     Number of items that should be in each page when navigating through list
    //
    // Returns: constrcuted list reference instance
    static buildListReference(
        handlerInput: HandlerInput,
        listProvider: ListProvider<any>,
        pageSize: number = 3
    ): ListReference {
        const listRef = {
            id: uuidv4(),
            listProviderName: listProvider.getName(),
            state: listProvider.serialize(),
            pageSize: pageSize
        } as ListReference;

        const providerState = listProvider.serialize();

        if (this.useSessionArgs){
            const argsState: ArgumentsState = {}
            // construct new session state instance, where arguments will be stored in session and used
            const newState = new ListNavSessionState({ activeList: listRef, providerState, argsState });
            newState.save(handlerInput);
        }
        else{
            // construct new session state instance, where no arguments will be stored in session
            const newState = new ListNavSessionState({ activeList: listRef, providerState });
            newState.save(handlerInput);
        }
        return listRef;
    }
    
    //enables the skill developer to explicitly set the active ListReference into the session, even when useSessionArgs is false
    static setActiveList(handlerInput: HandlerInput, listRef: ListReference) : void {
        const initialProviderState = listRef.state;
        if (this.useSessionArgs){
            const argsState: ArgumentsState = {}
            const newState = new ListNavSessionState({ activeList: listRef, providerState: initialProviderState, argsState });
            newState.save(handlerInput);
        }
        else{
            const newState = new ListNavSessionState({ activeList: listRef, providerState: initialProviderState});
            newState.save(handlerInput);
        }
    }

    static getSelectedItem(handlerInput: HandlerInput): any{
        if (ListNav.useSessionArgs){
            const sessionState = ListNavSessionState.load(handlerInput);
            const selectedItem = sessionState.argsState?.selectedItem;
            return selectedItem;
        }
    }

    // get the list provider instance for a list reference; reconstructs the list provider instance from
    // serialized state in the list reference object
    //
    // Arguments:
    //     handlerInput: HandlerInput instance for the current API request
    //     listRef: reference to get the provider for
    //
    // Returns: the reconstructed list provider instance
    //
    static getProvider(listRef: ListReference, providerState?: any) : ListProvider<any> {
        const deserializer = ListProviderRegistry.getDeserializer(listRef.listProviderName);

        if (deserializer == undefined) {
            throw new Error(`No list provider registered for ${listRef.listProviderName}`);
        }
        if (providerState === undefined){
            return deserializer(listRef.state);
        }
        return deserializer(providerState);
    }

    // creates all Alexa RequestHandler instances that need to be registered in a skill's API endpoint
    // for list navigation component to work correctly.
    //
    // Arguments:
    //     getPageApiName:           fully qualified name (FQN, including namespace) of the getPageApi 
    //                               passed into buildNavigationConfig in ACDL
    //     selectItemApiName:        FQN of the selectItemApi passed into buildNavigationConfig in ACDL
    //     indexOfItemByNameApiName: FQN of the indexOfItemByNameApi passed into buildNavigationConfig 
    //                               in ACDL
    //     itemNameMatcher:          Matcher callback method used to match a item name to a specific
    //                               item in the page of items being presented to the user; defaults
    //                               to a matcher that assumes each item has a "name" property to
    //                               match against
    //
    // Returns: array of constructed handlers
    static createHandlers(
        getPageApiName: string,
        selectItemApiName: string,
        indexOfItemByNameApiName: string,
        itemNameMatcher: ItemNameMatcher = IndexOfByNameHandler.defaultItemNameMatcher
    ): RequestHandler[] {
        return [
            // util handlers
            new ConvertOrdinalToIndexHandler(),
            new GenerateRandomIndexHandler(),

            // record-event handlers
            new RecordInitialEventHandler(),
            new RecordNextEventHandler(),
            new RecordPrevEventHandler(),

            // APIs that have to be defined by skill dev (as they use generics)
            new GetPageHandler(getPageApiName),
            new SelectItemHandler(selectItemApiName),
            new IndexOfByNameHandler(indexOfItemByNameApiName, itemNameMatcher)
        ];
    }
}