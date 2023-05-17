// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import {  RequestHandler } from "ask-sdk-core";
import { CheckoutProvider } from "./checkout-provider";
import { CheckoutHandler, ValidateOrderHandler } from "./handlers";
import { DefaultCheckoutProvider } from "./providers";

export class Checkout {
// Returns: array of constructed handlers
static createHandlers(
    provider : CheckoutProvider = new DefaultCheckoutProvider(),
): RequestHandler[] {
    
    return [
        
        // util handlers
        new CheckoutHandler(provider),
        new ValidateOrderHandler(provider)
    ];
    
}
}
