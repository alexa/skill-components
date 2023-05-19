# Checkout Skill Component


With the Checkout Skill Component, you can enable users to pay to the business for their goods or services like in a Food Delivery App, Shopping App etc. To use the Alexa Skill components, [sign up for the developer preview](https://build.amazonalexadev.com/2022-Skill-Components-Interest.html). We actively update these components and look forward to improving them with your feedback. To get the latest version, check back here often.

**Note:** Alexa Skill Components are provided as a pre-production alpha release in developer preview, with limited support. Our goal is to solicit feedback on our approach and design as we work toward general availability. While we make every effort to minimize issues with this pre-production alpha release, we can't promise backward compatibility or a rapid turn-around on bug fixes.

## Table Of Contents

* [Introduction](#introduction)
    * [When to use this component](#when-to-use-this-component)
    * [Example Interaction](#example-interaction)
* [Getting Started Process](#getting-started-process)
* [Reference](#reference)
* [Example skill](#example-skill)
* [Feedback](#feedback)
* [License](#license)

## Introduction

To reduce your development time, Alexa Skill Components are consistent with user experience best practices. The Checkout Skill Component lets users of your skill to add items in their cart, select the mode of payment and proceed to checkout.

### When to use this component

Are you building an app in which your users add items to a cart and can make online purchase with a full checkout experience? Use the pre-built interaction patterns within the Checkout Skill Component to build out and customize these interactions.

### Example interaction

Following is an example skill interaction that shows different paths a component user might follow. These scenarios are taken from the included [Online Food Ordering example skill](./examples/OnlineFoodOrdering).

#### Checkout Without Account Linking

```
User  > Buy me 3 burgers
Alexa > Added 3 burgers to your cart.Choose a mode of payment to checkout - Credit Card or Cash On Delivery.
User  > Cash On Delivery
Alexa > Selected Cash On Delivery as the mode of payment
User  > I want to checkout
Alexa > Your subtotal for 3 burgers is Rs 150. Would you like to checkout ?
User  > Yes
Alexa > Checkout Success! Your order is placed
```

```
User  > Buy me 3 burgers
Alexa > Added 3 burgers to your cart.Choose a mode of payment to checkout - Credit Card or Cash On Delivery.
User  > Credit Card
Alexa > Selected Credit Card as the mode of payment
User  > I want to checkout
Alexa > Your subtotal for 3 burgers is Rs 150. Would you like to checkout ?
User  > Yes
Alexa > Checkout Failed! Missing information to checkout with Credit Card as the mode of payment.
```

#### Checkout With Account Linking

```
User  > Buy me 3 pizzas
Alexa > Added 3 pizzas to your cart
User  > I want to checkout
Alexa > Your Account is not linked. I've sent information on the Alexa app to proceed.
//user goes to the Alexa App gets his account linked and re-initiates the flow
```

```
User  > Buy me 3 pizzas
Alexa > Added 3 pizzas to your cart
User  > I want to checkout.
Alexa > Your Account is linked in order to checkout. Proceeding to order confirmation
Alexa > Your subtotal for 3 pizzas is Rs 150. Would you like to checkout?
User  > Yes
Alexa > Checkout Success! Your order is placed
```

#### Minimum Amount Limit

The minimum limit to checkout are error conditions which do not affect the overall working of the component, these are just custom logics on the provider end which can be modified.

```
User  > Buy me 2 burgers
Alexa > Added 2 burgers to your cart.Choose a mode of payment to checkout - Credit Card or Cash On Delivery.
User  > Cash On Delivery
Alexa > Selected cash On Delivery as the mode of payment
User  > I want to checkout
Alexa > Your cart subtotal is Rs... It does not meet the minimum amount limit to checkout. Add some more items to your cart.
```

#### Maximum Amount Limit

The maximum limit to checkout are error conditions which do not affect the overall working of the component, these are just custom logics on the provider end which can be modified.

```
User  > Buy me 101 burgers
Alexa > Added 101 burgers to your cart.Choose a mode of payment to checkout - Credit Card or Cash On Delivery.
User  > Cash On Delivery
Alexa > Selected Cash On Delivery as the mode of payment
User  > I want to checkout
Alexa > Your cart subtotal is Rs... It exceeds the maximum amount limit to checkout.
```

## Getting Started Process

* [Step 1: Learn about Alexa Skill Components](#step-1-learn-about-alexa-skill-components)
* [Step 2: Install the Checkout component](#step-2-install-the-checkout-component)
* [Step 3: Call the reusable dialogs](#step-3-call-the-reusable-dialog)
* [Step 4: Configure InteractionModel](#step-4-configure-interactionmodel)
* [Step 5: Set up API handlers](#step-5-set-up-api-handlers)
* [Step 6: Compile and deploy](#step-6-compile-and-deploy)
* [Step 7: Test](#step-7-test)
* [Step 8: Iterate](#step-8-iterate)

### Step 1: Learn about Alexa Skill Components

Read the [Skill Components Getting Started Guide](https://github.com/alexa/skill-components#getting-started). If you're unfamiliar with skill development, the following example skills are a good starting place:

* [Hello World skill](https://developer.amazon.com/en-US/docs/alexa/custom-skills/tutorial-use-the-developer-console-to-build-your-first-alexa-skill.html)
* [Flight Search skill](https://developer.amazon.com/en-US/docs/alexa/workshops/acdl-flightsearch-tutorial/get-started/index.html)

### Step 2: Install the Checkout component

The next step is to install the Checkout Skill Component in your skill. If a `package.json` file doesn't already exist in the skill's root directory, create one with the following command.

```
npm init
```

Install the Checkout component from either the public release or a local build of the component.

#### Public release

In your skill's root directory, install using `npm`.

```
npm install --save @alexa-skill-components/checkout
npm install
```

Then install the component as a dependency in your API code (lambda).

```
npm install --save @alexa-skill-components/checkout
npm install
```

#### Local build

In a separate directory from your skill, build the Checkout component from source code.

```
git clone git@github.com:alexa/skill-components.git
cd skill-components
cd checkout
npm run clean-build
```

Then, in your skill's root directory, use `npm` to install the local build.

```
npm install --save "<path>/skill-components/checkout"
npm install
```

Also install the component as a dependency in your API code (lambda):

```
npm install --save "<path>/skill-components/checkout"
npm install
```

### Step 3: Call the Reusable Dialogs

Import and call the ACDL reusable dialogs provided by this component from your skill's own custom sample dialogs.

#### 1\. Import reusable dialogs and types

Import the component's reusable dialogs and types into your skill's ACDL.

```
namespace examples.checkout_skill

import com.amazon.alexa.skill.components.checkout.*
import com.amazon.alexa.skill.components.checkout.types.*
```

#### 2\. Build the configuration object

Call the buildCheckoutConfig ACDL reusable dialog in your skill's sample to build the configuration object needed for checkout to function, passing in the actions and events:

```
 CheckoutConfig
      {
          checkoutEvent = checkoutEvent,
          checkoutPrompt = checkoutPrompt,
          validationPrompt = validationPrompt,
          affirmUtterances=affirmUtterances

      }
```

#### 3\. Call reusable dialog

In one of your skill's samples, call the reusable CheckoutWithoutAccountLinking dialog to checkout without using Account Linking, passing in the previously built config, to generate dialog flows:

```
CheckoutWithoutAccountLinking(checkoutConfig)
```

Call the reusable Checkout dialog to checkout with Account Linking, passing in the previously built config, to generate dialog flows:

```
Checkout(checkoutConfig)
```

### Step 4: Configure Interaction Model

Add all the possible slot types and slot values in the InteractionModel of the skill.

```
{
    "interactionModel": {
    "languageModel": {
        ...
        "types": [
                {
                    "name": "PAYMENTMODE",
                    "values": [
                    {
                        "name": {
                        "value": "credit card"
                        }
                    },
                    {
                        "name": {
                        "value": "cash on delivery",
                        "synonyms": [
                            "cod",
                            "pay on delivery"
                        ]
                       }
                    }
               ]
         }
    }
}
```

### Step 5: Set up API handlers

Import and register the request handlers provided by the component into the skill's API code (where it will live along with the skill's other request handlers).

#### TypeScript


```
import { Checkout } from '@alexa-skill-components/checkout';

...

export const skillDomain = "examples.checkout_skill";

export const handler = SkillBuilders.custom()
    .addRequestHandlers(
        ...
        ...Checkout.createHandlers(
            new CustomProvider()
    ),
    )
.lambda();
```

#### Javascript

For an example, see [ OnlineFoodOrdering Example Skill](#example-skill).

```
const Checkout = require('@alexa-skill-components/checkout')

...

export const skillDomain = "examples.checkout_skill";

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        ...
        ...Checkout.createHandlers(
        new CustomProvider()
    ),
.lambda();
```

### Step 6: Compile and deploy

Build your skill as you normally would. The component's dialog samples and API handlers, which were integrated into the skill, are built along with your skill's own custom dialog samples and handlers. Note that an Alexa Conversations skill deployment can take 20-40 minutes to complete.

**Note:** Make sure the ask-cli-x and @alexa/acdl packages are up to date.

```
askx compile && askx deploy
```

### Step 7: Test

To use the CLI to test your component, enter the following command. Alternatively, use the Alexa Skills Kit Developer Console (click the **Test** tab) to simulate your skill's behavior.

```
askx dialog -s <YOUR_SKILL_ID> -l en-US -g development
```

### Step 8: Iterate

After testing the default behavior of the component, see the [Reference](./docs/REFERENCE.md) document for available customization to suit your needs.
For details, see the [Example Skills](#example-skill).

Deploy any changes, compile your code, and then deploy again.

```
askx compile && askx deploy
```

## Example skill

For an example skill, see [OnlineFoodOrdering](./examples/OnlineFoodOrdering).


## Feedback

Amazon welcomes your feedback. Connect with us on [Github](https://github.com/alexa/skill-components#support).

## License

Copyright 2022 Amazon.com, Inc., or its affiliates. All rights reserved. You may not use this file except in compliance with the terms and conditions set forth in the accompanying [LICENSE](https://github.com/alexa/skill-components/blob/main/LICENSE) file. THESE MATERIALS ARE PROVIDED ON AN "AS IS" BASIS. AMAZON SPECIFICALLY DISCLAIMS, WITH RESPECT TO THESE MATERIALS, ALL WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.