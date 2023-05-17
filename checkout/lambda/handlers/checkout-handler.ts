// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput } from 'ask-sdk-core';
import { Response } from "ask-sdk-model";
import { apiNamespace } from '../config';
import { CheckoutProvider} from "../checkout-provider";
import { BaseApiHandler } from './base-api-handler';
import * as util from '../util';

export class CheckoutHandler extends BaseApiHandler{
    
    static defaultApiName = `${apiNamespace}.checkout`;
    private provider : CheckoutProvider;
    constructor(
        //provider input
         provider : CheckoutProvider ,

         
    ) 
    
    {  
        super(CheckoutHandler.defaultApiName);
        this.provider = provider;
    }

   

    handle(handlerInput: HandlerInput): Response {
        const result =  this.provider.checkout(handlerInput)
        const modifiedResult = util.modifyCheckoutResultErrorBoolean(result);
        return handlerInput.responseBuilder
            .withApiResponse(modifiedResult)
            .withShouldEndSession(false)
            .getResponse();
    }
}