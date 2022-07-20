// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { getRequestType, HandlerInput } from 'ask-sdk-core';
import { interfaces, SlotValue } from "ask-sdk-model";
import APIInvocationRequest = interfaces.conversations.APIInvocationRequest;
import { CustomSkillRequestInterceptor } from 'ask-sdk-core/dist/dispatcher/request/interceptor/CustomSkillRequestInterceptor';
import { CustomSkillResponseInterceptor } from 'ask-sdk-core/dist/dispatcher/request/interceptor/CustomSkillResponseInterceptor';
import * as _ from 'lodash';


export const getAPIName = (handlerInput : HandlerInput) => {
    return (handlerInput.requestEnvelope.request as APIInvocationRequest).apiRequest?.name;
};

/**
 * Helper method to find if a request is a API request, optionally for a specific API
 */
export const isApiRequest = (handlerInput : HandlerInput, apiName? : string) => {
    const isApiRequest = getRequestType(handlerInput.requestEnvelope) === 'Dialog.API.Invoked';

    if (apiName) {
        return isApiRequest && getAPIName(handlerInput) === apiName;
    } else {
        return isApiRequest;
    }
};
export const isApiRequestPrefix = (handlerInput : HandlerInput, apiName : string): boolean => {
    const isApiRequest = getRequestType(handlerInput.requestEnvelope) === 'Dialog.API.Invoked';

    return isApiRequest && (getAPIName(handlerInput)?.startsWith(apiName) || false);
};

/**
 * Helper method to get API request entity from the request envelope.
 */
export const getApiArguments = (handlerInput : HandlerInput) => {
    return (handlerInput.requestEnvelope.request as APIInvocationRequest).apiRequest?.arguments || {};
};

/**
 * Helper method to get API resolved entity from the request envelope.
 */
export const getApiSlots = (handlerInput : HandlerInput) => {
    return (handlerInput.requestEnvelope.request as APIInvocationRequest).apiRequest?.slots || {};
};

export const getSlotResolvedValue = (slot : SlotValue) => {
    const firstAuthority = _.first(_.get(slot, 'resolutions.resolutionsPerAuthority'));
    const firstAuthorityValue = _.first(_.get(firstAuthority, 'values'));
    return _.get(firstAuthorityValue, 'value.name');
};

export const getResolvedApiSlotValues = (handlerInput : HandlerInput) => {
    const slots = getApiSlots(handlerInput);

    const resolvedSlotValues : any = {};
    for(const slotName of Object.keys(slots)){
        resolvedSlotValues[slotName] = getSlotResolvedValue(slots[slotName]);
    }
    return resolvedSlotValues;
};


export const getSlotResolvedId = (slot: SlotValue) => {
    const firstAuthority = _.first(_.get(slot, 'resolutions.resolutionsPerAuthority'));
    const firstAuthorityValue = _.first(_.get(firstAuthority, 'values'));
    return _.get(firstAuthorityValue, 'value.id');
};

export const getResolvedApiSlotIds = (handlerInput : HandlerInput) => {
    const slots = getApiSlots(handlerInput);

    const resolvedSlotIds : any = {};
    for(const slotName of Object.keys(slots)){
        resolvedSlotIds[slotName] = getSlotResolvedId(slots[slotName]);
    }
    return resolvedSlotIds;
};

export const RequestInterceptor : CustomSkillRequestInterceptor = {
    process(handlerInput) {
        console.log(`FULL INPUT = ${JSON.stringify(handlerInput)}`);

        if (handlerInput.requestEnvelope) {
            console.log(`REQUEST ENVELOPE = ${JSON.stringify(handlerInput.requestEnvelope)}`);
            if (handlerInput.requestEnvelope.request) {
                console.log(`REQUEST = ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
                if (isApiRequest(handlerInput)) {
                    console.log(`API NAME = ${getAPIName(handlerInput)}`);
                    console.log(`API ARGS = ${JSON.stringify(getApiArguments(handlerInput))}`);
                    console.log(`API SLOTS = ${JSON.stringify(getApiSlots(handlerInput))}`);
                    console.log(`API SLOT IDS = ${JSON.stringify(getResolvedApiSlotIds(handlerInput))}`);
                    console.log(`API SLOT VALUES = ${JSON.stringify(getResolvedApiSlotValues(handlerInput))}`);
                }
            }
        }
    }
};

export const ResponseInterceptor : CustomSkillResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`RESPONSE = ${JSON.stringify(response)}`);
    },
};

