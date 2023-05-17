import { CheckoutProvider } from '@alexa-skill-components/checkout';
import { CheckoutResult } from '@alexa-skill-components/checkout';
import { HandlerInput } from 'ask-sdk-core';
	 
	 
	 export class CustomProvider implements CheckoutProvider {
	    
	     orderValidation(handlerInput: HandlerInput): CheckoutResult {
	 
	         const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
	         const quantity = sessionAttributes.quantity
	         const total = quantity*50;
	 
	        //minimum limit prompt for checkout: would throw min limit prompt for quantity<3
	         if (quantity < 3) return {
	             error: true,
	             errorCode: "MINIMUM_AMOUNT",
	             total
	         } as CheckoutResult

			//maximum limit prompt for checkout: would throw max limit prompt for quantity>100
	         else if (quantity > 100) return {
	             error: true,
	             errorCode: "MAXIMUM_AMOUNT",
	             total
	         } as CheckoutResult
	        
			//returns order subtotal as a part of order validation
	         else {return {
	             error: false,
	             errorCode: "SUBTOTAL",
	             total
	         } as CheckoutResult
	         }
	     }
	 
	     checkout(handlerInput: HandlerInput): CheckoutResult {
	         const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
	         const payment = sessionAttributes.payment
	        
			//checkout failed prompt with credit card as the mode of payment
	         if(payment=='credit card') return{
	             error: true,
	             errorCode: "CREDIT_CARD"
	         } as CheckoutResult
	        
			//prompt for returning checkout success
	         return {
	             error: false,
	         } as CheckoutResult
	      //statically returning successful checkout
	    }
	}