import { HandlerInput } from 'ask-sdk-core';
import _ from 'lodash';
import { CheckoutProvider, CheckoutResult } from '../checkout-provider';



export class DefaultCheckoutProvider implements CheckoutProvider{

    
    orderValidation(handlerInput : HandlerInput): CheckoutResult {
        return {
            error: true,
        } as CheckoutResult
    }

    checkout(handlerInput : HandlerInput): CheckoutResult {
        return {
            error: true,
        } as CheckoutResult
    }

}