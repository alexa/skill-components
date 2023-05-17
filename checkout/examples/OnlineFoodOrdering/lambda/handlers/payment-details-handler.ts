// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { getApiArguments, isApiRequest } from '@alexa-skill-components/checkout/dist/util';

// called to return payment details and select among the mode of payment available
// Will pull payment from session to return as a response
export class PaymentDetailsHandler implements RequestHandler{
canHandle(handlerInput : HandlerInput): boolean {
	return isApiRequest(handlerInput, 'examples.checkout_skill.paymentDetails' );
}

handle(handlerInput : HandlerInput) {
const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
const args = getApiArguments(handlerInput)
sessionAttributes.payment =  args.payment;
handlerInput.attributesManager.setSessionAttributes(sessionAttributes);


const result = args.payment;
console.log("\nRESULT:", result, "\n");

return handlerInput.responseBuilder
	.withApiResponse({payment: result})
	.withShouldEndSession(false)
	.getResponse();
}
}