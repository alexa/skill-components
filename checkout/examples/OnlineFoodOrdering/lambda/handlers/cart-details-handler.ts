// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { getApiArguments, isApiRequest } from '@alexa-skill-components/checkout/dist/util';

// called to return cart details and items added in the cart
// Will pull quantity from session to return as a response
export class CartDetailsHandler implements RequestHandler{
canHandle(handlerInput : HandlerInput): boolean {
	return isApiRequest(handlerInput, 'examples.checkout_skill.AddToCart' );
}

handle(handlerInput : HandlerInput) {
	const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
	const args = getApiArguments(handlerInput)
	sessionAttributes.quantity =  args.quantity;
	handlerInput.attributesManager.setSessionAttributes(sessionAttributes);


const result = args.quantity;
console.log("\nRESULT:", result, "\n");

return handlerInput.responseBuilder
	.withApiResponse({quantity: result})
	.withShouldEndSession(false)
	.getResponse();
}
}