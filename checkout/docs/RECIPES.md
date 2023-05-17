# Checkout Component Recipes


# Creating a Custom Checkout Provider


By default, the component provides a sample provider which is an implementation of [Checkout interface](https://github.com/alexa/skill-components/blob/main/checkout/lambda/checkout-provider.ts#L54-L97). To customize this, simply define your own provider class implementing CheckoutProvider with the functions as defined below in your lambda code.

```typescript
import { CheckoutProvider } from '@alexa-skill-components/checkout';
import { CheckoutResult } from '@alexa-skill-components/checkout';
import { HandlerInput } from 'ask-sdk-core';


export class CustomProvider implements CheckoutProvider {

    orderValidation(handlerInput: HandlerInput): CheckoutResult {

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const quantity = sessionAttributes.quantity
        const total = quantity*50;

        if (quantity < 3) return {
            error: true,
            errorCode: "MINIMUM_AMOUNT",
            total
        } as CheckoutResult

        else if (quantity > 100) return {
            error: true,
            errorCode: "MAXIMUM_AMOUNT",
            total
        } as CheckoutResult

        return {
            error: false,
            errorCode: "SUBTOTAL",
            total
        } as CheckoutResult
    }

    checkout(handlerInput: HandlerInput): CheckoutResult {
        return {
            error: false,
        } as CheckoutResult
     //statically returning successfull checkout
    }
}
```


