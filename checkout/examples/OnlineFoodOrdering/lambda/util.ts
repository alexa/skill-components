// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/
	 
import { getRequestType, HandlerInput } from 'ask-sdk-core';
import { CustomSkillRequestInterceptor } from 'ask-sdk-core/dist/dispatcher/request/interceptor/CustomSkillRequestInterceptor';
import { CustomSkillResponseInterceptor } from 'ask-sdk-core/dist/dispatcher/request/interceptor/CustomSkillResponseInterceptor';
import { Utils } from '@alexa-skill-components/checkout';
import APIInvocationRequest = interfaces.conversations.APIInvocationRequest;
import { interfaces } from 'ask-sdk-model';

// custom request interceptor to record details about the request being processed; useful for debugging
export const loggingRequestInterceptor : CustomSkillRequestInterceptor = {
	process(handlerInput) {

	

		console.log(`FULL INPUT = ${JSON.stringify(handlerInput)}`);

		if (handlerInput.requestEnvelope) {
			console.log(`REQUEST ENVELOPE = ${JSON.stringify(handlerInput.requestEnvelope)}`);
			if (handlerInput.requestEnvelope.request) {
				console.log(`REQUEST = ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
				console.log(`REQUEST TYPE = ${getRequestType(handlerInput.requestEnvelope)}`);
				if (Utils.isApiRequest(handlerInput)) {
					console.log(`API NAME = ${Utils.getAPIName(handlerInput)}`);
					console.log(`API ARGS = ${JSON.stringify(Utils.getApiArguments(handlerInput))}`);
					console.log(`API SLOTS = ${JSON.stringify(Utils.getApiSlots(handlerInput))}`);
					console.log(`API SLOT IDS = ${JSON.stringify(Utils.getResolvedApiSlotIds(handlerInput))}`);
					console.log(`API SLOT VALUES = ${JSON.stringify(Utils.getResolvedApiSlotValues(handlerInput))}`);
				}
			}
		}
	}
};

// custom response interceptor to record details about the response; useful for debugging
export const loggingResponseInterceptor : CustomSkillResponseInterceptor = {
	process(handlerInput, response) {
		console.log(`RESPONSE = ${JSON.stringify(response)}`);
	},
};

// util to get the raw arguments for a API request
export const getApiArguments = (handlerInput: HandlerInput) => {
	return (handlerInput.requestEnvelope.request as APIInvocationRequest).apiRequest?.arguments || {};
};