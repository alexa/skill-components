  import { SkillBuilders } from 'ask-sdk-core';
  import { Checkout } from '@alexa-skill-components/checkout';
  import { CartDetailsHandler } from './handlers';
  import { CustomProvider } from './providers';
  import { PaymentDetailsHandler } from './handlers/payment-details-handler';


  // The SkillBuilder acts as the entry point for your skill, routing all request and response
  // payloads to the handlers above. Make sure any new handlers or interceptors you've
  // defined are included below. The order matters - they're processed top to bottom.

  export const handler = SkillBuilders.custom()
    .addRequestHandlers(
        new CartDetailsHandler(),
        new PaymentDetailsHandler(),

    // register all the handlers required for checkout component to function;
    // passing the custom provider within createHandlers
    ...Checkout.createHandlers(
      new CustomProvider()
    )
    )

  .lambda();