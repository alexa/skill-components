# Checkout Component References

## ACDL Reusable Dialogs

### buildCheckoutConfig

Used to build the configuration that can be passed into CheckoutFlow; all config properties have defaults specified where possible, though APIs that utilize generic parameters must be specified by the caller (developer) due to limitations in ACDL.

#### Type Parameters

* `CheckoutConfig`
    * A type which has all the properties required to checkout.

#### Arguments

* `Event<Nothing> checkoutEvent` (required)
    * checkoutEvent which triggers when a user initiates checkout.

* `Response checkoutPrompt` (required)
    * Passed in the response after checkout action being called.

* `Response validationPrompt` (required)
    * Passed in the response after validation action being called.

* `Event<Nothing> affirmUtterances`(required)

* affirmUtterances to treat event as an affirmation.

#### Returns

Constructed configuration object i.e. `CheckoutConfig`.

### CheckoutWithoutAccountLinking

Reusable dialog that enables a user to checkout without their account linked.

### Arguments

* `CheckoutConfig config` (required)
    * Consists of checkoutEvent, checkoutPrompt, validationPrompt and an affirmUtterance Event, see `buildCheckoutConfig` dialog for how to build a config object.

#### Returns

`CheckoutResult` which has Number error and String errorCode which indicates if the checkout was successful or not.

### Checkout

Reusable dialog that enables a user to checkout with Account Linking.

#### Arguments

* `CheckoutConfig config` (required)
    * Consists of checkoutEvent, checkoutPrompt, validationPrompt and an affirmUtterance Event, see `buildCheckoutConfig` dialog for how to build a config object.

#### Returns

`CheckoutResult` which has Number error and String errorCode which indicates if the checkout was successful or not.

## Important API Classes and Types

### `class Checkout`

Main static interface to checkout component on API side.

#### Methods

* `static createHandlers`
    *  creates all Alexa RequestHandler instances that need to be registered in a skill's API endpoint for checkout component to work correctly.

* Arguments:
    * `provider : CheckoutProvider`: provider object to be passes as input in the Handlers.

* Returns: array of constructed handlers

### `interface CheckoutProvider`

Interface every checkout provider must adhere to, contains methods used by checkout component handlers.

#### Methods

* `checkout(`
`handlerInput: HandlerInput`
`): CheckoutResult `

* to end the checkout flow and to generate a final confirmation message

* orderValidation(`
`handlerInput: HandlerInput`
`): CheckoutResult `

* called to validateOrder to proceed with the order confirmation and generate either an optional error message or a validation response

### `class defaultCheckoutProvider`

A sample checkout provider provided for defining the Checkout and OrderValidation functions which return error and errorCodes as a part of CheckoutResult.