import { HandlerInput } from "ask-sdk-core"

export interface CheckoutResult{
    errorCode: string
    error: boolean
}

export interface CheckoutProvider {
 
    // validateOrder to proceed with the order confirmation and generate either an 
    // optional error message or a validation response
    orderValidation(handlerInput: HandlerInput) : CheckoutResult
    
    
    // end flow of the checkout to generate a final confirmation message
    checkout(handlerInput: HandlerInput): CheckoutResult

}