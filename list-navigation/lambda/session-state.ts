// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';

import { ListNav } from './interface';
import { ListProvider, Page, PagingDirection } from './list-provider';
import { ListReference } from './interface';
import { PageToken } from './list-provider';

// key in session where all the list navigation session state will be stored
const sessionKey = "_ac_listNav";

// collection of just the tokens from a page object; used to avoid storing 
// entire list of page items in the session
export interface PageTokens {
    prevPageToken?: PageToken;
    currentPageToken: PageToken;
    nextPageToken?: PageToken;
}

// representation of raw state data stored in the session
interface PlainSessionState {
    activeList: ListReference;
    providerState: any;
    argsState?: ArgumentsState;
}

// State arguments stored into the session that will be used instead of relying on arguments passed into 
// APIs if ListNav.useSessionArgs is true
//
// Note: simply used to work around issues with passing data in API arguments between turns in some 
// list nav scenarios, can be removed once data passing via API arguments is fixed
export interface ArgumentsState{

    // current page being shown for the active list; set by performSearch, getPage and selectItem APIs;
    // used by record-event APIs called before getPage instead of relying on the page token
    // passed via API arguments
    currentPageTokens?: PageTokens;

    // page token that should be passed into the next getPage API call; set by record-event APIs
    // called before getPage (based on the currentPage below, if it exists); used by getPage API
    // instead of the page token passed via API arguments
    upcomingPageToken?: PageToken;
    
    // current paging direction; set by record-event APIs; used by getPage API
    pagingDirection?: PagingDirection;

    // current selected item
    selectedItem?: any;
}

export class ListNavSessionState {

    // the list actively being navigated; set when a new list reference is built; used by 
    // getPage and selectItem APIs instead of relying on list reference passed via API arguments
    activeList: ListReference;

    providerState: any;

    argsState?: ArgumentsState;

    constructor(plainState: PlainSessionState) {
        this.activeList = plainState.activeList;
        this.providerState = plainState.providerState;
        this.argsState = plainState.argsState;
    }

    // get the current page according to this session state instance
    getCurrentPage(): Promise<Page<any>>{
        const listRef = this.activeList;
        const providerState = this.providerState;
        const listProvider: ListProvider<any> = ListNav.getProvider(listRef, providerState);

        // if there is no current page set in the session, then we will retrieve the
        // first page of items
        let currentPageToken: PageToken | undefined = undefined;
        if (this.argsState?.currentPageTokens != undefined) {
            currentPageToken = this.argsState.currentPageTokens.currentPageToken;
        }
        let pagingDirection: PagingDirection | undefined = undefined;
        if (this.argsState?.pagingDirection != undefined) {
            pagingDirection = this.argsState.pagingDirection;
        }
        return listProvider.getPage(currentPageToken, listRef.pageSize, pagingDirection);
    }

    // validate the arguments that were passed into a API call match the state currently stored in
    // the session; if not, log the discrepencies. This will help to identify scenarios where
    // API call arguments are incorrect
    validateArguments(listRefArg?: ListReference, currentPageTokenArg?: PageToken) {
        if (listRefArg != undefined) {
            const listRef = this.activeList.id;
            if (listRefArg.id != listRef) {
                console.log(`List ref API arg mismatch; expected: ${JSON.stringify(listRef)}, " +
                    "actual: ${JSON.stringify(listRefArg)}`);
            }
        }

        if (currentPageTokenArg != undefined) {
            const currentPageToken = this.argsState?.currentPageTokens?.currentPageToken;
            if (currentPageTokenArg != currentPageToken) {
                console.log(`SelectItemHandler: current page token mismatch; expected ${currentPageToken}, actual: ${currentPageTokenArg}`);
            }
        }
    }
    
    private serialize(): PlainSessionState {
        return {
            activeList: this.activeList,
            providerState: this.providerState,
            argsState: this.argsState
        } as PlainSessionState;
    }

    // save this session state into the current skill session
    save(handlerInput : HandlerInput): void {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes(); 
        const plainState = this.serialize();
        sessionAttributes[sessionKey] = plainState;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        console.log(`ListNavSessionState: saved new state: ${JSON.stringify(plainState)}`);
    }

    // clear list nav session state stored in current skill session
    static clear(handlerInput : HandlerInput, listId: string) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        delete sessionAttributes[sessionKey];
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    }

    // load the list nav session state stored in current skill session;
    // will throw a error if no session state is currently stored
    static load(handlerInput : HandlerInput) : ListNavSessionState {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const plainState: PlainSessionState | undefined = sessionAttributes[sessionKey];
        if (plainState == undefined || plainState.activeList == undefined) {
            throw new Error("No list nav state present in session, please setup list nav state prior to "+
                "using component by calling ListNav.buildListReference()");
        }
        console.log(`ListNavSessionState: loaded list nav session state: ${JSON.stringify(plainState)}`);
        return new ListNavSessionState(plainState);
    }
}
