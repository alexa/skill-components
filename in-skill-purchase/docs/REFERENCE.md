# Overview

# ACDL Reusable Dialogs

## buySpecificProduct

Dialog to trigger the purchase workflow for in skill purchase

### Arguments
* `Response chooseProductResponse` 
  * Response template used when user wants to see the products available for purchase
  * Defaults to simple built-in response (`dCP`) to iterate through the in skill product list up to 3 products
* `Response continueSkillResponse` 
  * Response template used when user is not interested in  buying the in skill products
  * Defaults to simple built-in response (`dCS`)
* `Response productNotAvailableResponse` 
  * Response template used when user wants to buy a product which is not purchasable
  * Defaults to simple built-in response (`dPNA`)
* `Response requestProductResponse` 
  * Response template used when user does not specify which product they want to buy or know more about
  * Defaults to simple built-in response (`dRP`)
* `Event <BuySpecificProductRequest> buySpecificProductEvent`
  * Event for user to provide which product they want to buy or know more about.
  * Defaults to a built-in set of spoken utterances (`defaultBuySpecificProductEvent`) including  
    "{productName}",
    "buy the {productName}",
    "buy {productName}",
    "I want to buy {productName}",
    "I would like to buy {productName}",
    "I'd like to buy {productName}",
    "tell me about {productName}",
    "tell me more about {productName}",
    "learn more about {productName}",
    "I want to learn more about {productName}",
    "I would like to learn more about {productName}",
    "I'd like to learn more about {productName}"
* `Event<Nothing> whatCanIBuyEvent = defaultWhatCanIBuyEvent`
  * Event for user to invoke the purchase workflow
  *  Defaults to a built-in set of spoken utterances (`defaultWhatCanIBuyEvent`) including  
    "What can I buy?",
    "What are you selling?",
    "What comes with a subscription?",
    "What’s new?",
    "Which product can I buy?",
    "What can I choose to buy?"
* `Event<Nothing> noEvent = defaultNoEvent`
  * Event for user to invoke resume flow when the user doesn't want to buy the product
  *  Defaults to a built-in set of spoken utterances (`defaultNoEvent`) including  
    "No",
    "Nope",
    "Nothing",
    "No i'm good",
    "I'm good",
    "No thank you",
    "No thanks",
    "No i do not",
    "No i don't",
    "No i do not want to buy any of these",
    "No i dont want to buy them",
    "I do not want anything else",

### Return Value

Reusable dialog returns nothing

## cancelPurchase

Dialog to trigger the cancel workflow for in skill purchase

### Arguments
* `Response productNotAvailableForCancelResponse` 
  * Response template used when user wants to cancel a product which is not available for cancel
  * Defaults to simple built-in response (`dPNAR`) 
* `Event <CancelSpecificProductRequest> cancelEvent`
  * Event for user to provide which product they want to buy or know more about.
  * Defaults to a built-in set of spoken utterances (`defaultCancelEvent`) including  
    "cancel my {productName}", 
    "cancel {productName}",
    "I want to cancel {productName}",
    "I want to cancel my {productName}",
    "I'd like to cancel {productName}",
    "I'd like to cancel my {productName}",
    "I would like to cancel {productName}",
    "I would like to cancel my {productName}",
    "I hope to cancel {productName}",
    "I hope to cancel my {productName}",
    "please cancel {productName}",
    "please cancel my {productName}",

### Return Value

Reusable dialog returns nothing
dialog Nothing resumeAfterPurchase (Response purchaseSuccess=defPS, Response alreadyPurchased = defAP, Response rejectCancel= defRC, Response continueSkill= defCS) {

## resumeAfterPurchase

Dialog can be triggered from where you want to resume the skill after purchase/cancel/upsell is finished.

### Arguments
* `Response purchaseSuccessResponse` 
  * Response template which decides how you wants to take the flow ahead after a successful purchase
  * Defaults to simple built-in response (`dPS`) 
* `Response alreadyPurchasedResponse` 
  * Response template which decides how you wants to take the flow ahead after a user tries to purchase a product which is already purchased
  * Defaults to simple built-in response (`dAP`) 
* `Response rejectCancelResponse` 
  * Response template which decides how you wants to take the flow ahead after a user decides to stick around and not cancel their subscription
  * Defaults to simple built-in response (`dRC`) 
* `Response continueSkillResponse` 
  * Defaults to simple built-in response (`dCS`) 


### Return Value

Reusable dialog returns nothing

## upsell

Dialog to trigger the upsell workflow for in skill purchase
Note: This dialog must be preceded with a expect() or a API call

### Arguments
* `String upsellMessage` (required)
  * Message which should be displayed while upsell of that product.
* `ProductName productName` (required)
  * Upsell product name. 
  
### Return Value

Reusable dialog returns nothing