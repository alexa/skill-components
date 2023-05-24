// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { v4 as uuidv4 } from 'uuid';
import { ListNav } from "@alexa-skill-components/list-navigation";

import {
    ModifyHandler,
    ScheduleHandler, ShowBookingsHandler, CancelHandler, SetSelectedBookingHandler

} from "./handlers";
import { ProviderRegistry, SchedulingProvider } from "./provider";
import { ArgumentsState, SchedulingComponentSessionState } from "./state";

export interface SchedulingReference {
    id: string;

    schedulingProviderName: string;
    state: any;

    // number of items in each page
    pageSize: number
}


export class SchedulingComponent {

    static useSessionArgs: boolean = true;

    // build a scheduling reference instance for a given scheduling provider instance
    //
    // Arguments:
    //     handlerInput: HandlerInput instance for the current API request, needed to store state into current
    //                   session
    //     schedulingProvider: SchedulingProvider instance for the scheduling to build a reference for
    //     pageSize:     Number of items that should be in each page when navigating through scheduling
    //
    // Returns: constrcuted scheduling reference instance
    static buildSchedulingReference(
        handlerInput: HandlerInput,
        schedulingProvider: SchedulingProvider<any>,
        pageSize: number = 3
    ): SchedulingReference {

        const schedulingRef = {
            id: uuidv4(),
            schedulingProviderName: schedulingProvider.getName(),
            state: schedulingProvider.serialize(),
            pageSize: pageSize
        } as SchedulingReference;

        // state data required by the scheduling provider is stored;
        // used to reconstruct scheduling provider instance
        const providerState = schedulingProvider.serialize();

        if (this.useSessionArgs) {
            const argsState: ArgumentsState = {}
            // construct new session state instance, where arguments will be stored in session and used
            const newState = new SchedulingComponentSessionState({ activeRef: schedulingRef, providerState, argsState });
            newState.save(handlerInput);
        }
        else {
            // construct new session state instance, where no arguments will be stored in session
            const newState = new SchedulingComponentSessionState({ activeRef: schedulingRef, providerState });
            newState.save(handlerInput);
        }

        return schedulingRef;
    }

    static isActiveRefSet(handlerInput: HandlerInput): boolean {
        const sessionState = SchedulingComponentSessionState.getPlainSessionState(handlerInput);
        if (sessionState && sessionState.activeRef) {
            return true;
        }
        return false;
    }

    static getProvider(schedulingRef: SchedulingReference, providerState?: any): SchedulingProvider<any> {
        const deserializer = ProviderRegistry.getDeserializer(schedulingRef.schedulingProviderName);

        if (deserializer == undefined) {
            throw new Error(`No scheduling provider registered for ${schedulingRef.schedulingProviderName}`);
        }
        if (providerState == undefined) {
            return deserializer(schedulingRef.state);
        }
        return deserializer(providerState);
    }

    static createHandlers(
        scheduleApiName: string,
        getBookingsPageApiName: string,
        selectBookingApiName: string,
        indexOfBookingByNameApiName: string,
        modifyBookingApiName: string,
        cancelBookingApiName: string
    ): RequestHandler[] {
        return [
            
            // APIs that have to be defined by skill dev (as they use generics)
            new ScheduleHandler(scheduleApiName),

            new ShowBookingsHandler(`com.amazon.alexa.skill.components.scheduling.show.showBookingsAction`),

            ...ListNav.createHandlers(
                getBookingsPageApiName,
                selectBookingApiName,
                indexOfBookingByNameApiName
            ),

            new SetSelectedBookingHandler(),

            new ModifyHandler(modifyBookingApiName),

            new CancelHandler(cancelBookingApiName)
        ];
    }
}