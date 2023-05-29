// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';

import { SchedulingReference } from './interface';

// key in session where all the scheduling component session start will be stored
const sessionKey = "_ac_schedulingComponent";

// representation of raw state data stored in the session
interface PlainSessionState {
    activeRef: SchedulingReference;
    providerState: any;
    argsState?: ArgumentsState
}

export interface ArgumentsState{
    schedulingInfo? : any;
}

// State stored into the session
export class SchedulingComponentSessionState {

    activeRef: SchedulingReference;
    
    // state data required by the scheduling provider;
    // used to reconstruct scheduling provider instance
    providerState: any;
    
    // arguments stored into the session
    argsState?: ArgumentsState;

    constructor(plainState: PlainSessionState) {
        this.activeRef = plainState.activeRef;
        this.providerState = plainState.providerState;
        this.argsState = plainState.argsState;
    }

    private serialize(): PlainSessionState{
        return {
            activeRef: this.activeRef,
            providerState: this.providerState,
            argsState: this.argsState
        } as PlainSessionState;
    }

    // save this session state into the current skill session
    save(handlerInput: HandlerInput): void {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const plainState = this.serialize();
        sessionAttributes[sessionKey] = plainState;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        console.log(`SchedulingComponentSessionState: saved new state: ${JSON.stringify(plainState)}`);
    }

    // clear session state stored in current skill session
    static clear(handlerInput: HandlerInput): void {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        delete sessionAttributes[sessionKey];
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    }

    // load the scheduling component session state stored in current skill session;
    // will throw a error if no session state is currently stored
    static load(handlerInput: HandlerInput): SchedulingComponentSessionState {
        const plainState = this.getPlainSessionState(handlerInput);
        if (plainState == undefined || plainState.activeRef == undefined) {
            throw new Error("No scheduling component state present in session, please setup scheduling component state prior to " +
                "using component by calling SchedulingComponent.buildSchedulingReference()");
        }
        console.log(`SchedulingComponentSessionState: loaded session state: ${JSON.stringify(plainState)}`);
        return new SchedulingComponentSessionState(plainState);
    }

    static getPlainSessionState(handlerInput: HandlerInput) : PlainSessionState | undefined {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const plainState: PlainSessionState | undefined = sessionAttributes[sessionKey];
        return plainState;
    }
}