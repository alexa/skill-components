<p align="center">
  <h1 align="center">In Skill Purchase Component</h1>
</p>

Gather feedback on interactions to help drive skill development.

**Please note**: Alexa Skill Components are being provided as a pre-production alpha 
release in Developer Preview with limited support. Our goal is to solicit feedback on our approach and design building towards their broader general availability in the future. While we will make every effort to minimize it, we do not make any backwards compatibility or rapid 
turn-around bug-fix promises with this pre-production alpha release. You can [sign 
up for the developer preview](https://build.amazonalexadev.com/2022-Skill-Components-Interest.html) here to use these components.

We will be actively making updates to these components and we look forward to mature them with your feedback. So, check back in here to get the latest and greatest version. 

[Sign up and join us](https://build.amazonalexadev.com/2022-Skill-Components-Interest.html) in our effort to help you build more engaging Alexa skills faster!

## Table of Contents

* [Introduction](#introduction)
  * [When should I use this component?](#when-should-i-use-this-component)
  * [Example Interaction](#example-interaction)
* [Getting Started](#getting-started)
* [Reference](#reference)

## Introduction
Alexa Skill Components encapsulate best customer experience (CX) design practices to reduce your development time. Learn more about Skill Components in the [Skill Components Getting Started guide](../README.md#getting-started). The In-skill Purchasing Reusable Skill Component can be used to add the [in-skill purchasing workflow](https://developer.amazon.com/en-US/docs/alexa/in-skill-purchase/isp-overview.html) into the skill, which lets Alexa Skill developers to sell premium content, such as game features or any other subscription in custom skills. For the current version of the component, it mainly supports payment model of subscriptions which are offers access to premium content or features for a period of time, charged on a recurring basis until the user cancels the subscription. 

### When should I use this component?
Are you building an app in which you would like the customer to add the in-skill purchasing workflow into the skill, which lets Alexa Skill developers to sell premium content, such as game features or any other subscription in custom skills. Use the pre-built interaction patterns within the In Skill Purchase Component to build out and customize such interactions.

### Example Interaction

This is just a sample interaction of a skill which has 3 in skill purchase products (Value subscription,Premium Subscription,Elite Subscription). 
Purchase scenario:

```
User  > What can I buy?
Alexa > With our Value subscription, you can access 45+ mindfull sessions; with our Premium Subscription, you can add on 150+ guided workouts, and with our Elite Subscription, you can set up dedicaed sessions with our certified trainers. Which one would you like to learn more about?
User  > Tell me more about Elite Subscription
Alexa > Elite subscription is free for 7 days . Then you’ll be automatically charged $0.99 a month plus tax. Cancel anytime. Check the Alexa app for terms. Should I start your free trial?
User > Yes
Alexa > Great! You're signed up.
```
Cancel scenario:

```
User  > Cancel Elite subscription
Alexa > Okay! As a reminder, with elite subscription you can set up dedicated sessions with our certified trainers. Are you sure you want to cancel your subscription?
User  > Yes
Alexa > Okay, I've canceled elite subscription, and you'll no longer be charged. You can continue to use it until the end of this subscription period.
```

## Getting Started

### 1. Familiarize yourself with Alexa Skill Components

Read [Skill Components Getting Started guide](../README.md#getting-started)

For those unfamiliar with skill development, the [flight search example skill tutorial](https://developer.amazon.com/en-US/docs/alexa/workshops/acdl-flightsearch-tutorial/get-started/index.html) is a good starting place.

### 2. Adding in-skill purchase products to your existing skill.

1. Any existing ACDL Alexa Skill or [Get Started with ACDL Alexa Skill](https://developer.amazon.com/en-US/docs/alexa/conversations/acdl-get-started.html). 
2. [Create and Manage In-Skill Products](https://developer.amazon.com/en-US/docs/alexa/in-skill-purchase/create-isp-dev-console.html)
Note: For this version we only support in-skill purchase product of type subscription

### 3. Install component in your skill

Note that if a `package.json` file does not already exist in the skill's root directory, then one can be created with:
```
npm init
```

Install the component either from public release or a local build of the component:

**Public Release**

In your skill's root directory, install using npm:
```
npm install --save @alexa-skill-components/in-skill-purchase
npm install
```

Also install the component as a dependency in your API code (lambda):
```
npm install --save @alexa-skill-components/in-skill-purchase
npm install
```

**Local Build**

In a seperate directory from your skill, build component from source:
```
git clone git@github.com:alexa/skill-components.git
cd skill-components
cd in-skill-purchase
npm run clean-build
```

then, in your skill's root directory, use npm to install the local build:
```
npm install --save "<path>/skill-components/in-skill-purchase"
npm install
```

Also install the component as a dependency in your API code (lambda):
```
npm install --save "<path>/skill-components/in-skill-purchase"
npm install
```

### 4. Call reusable dialog

*1.1. Invoke purchase RD in your existing ACDL dialog from where you want to direct user to choose a product or start the purchase flow with a product specified.* 

Import and call [`buySpecificProduct`](./docs/REFERENCE.md#buySpecificProduct) 
ACDL Sample Example consuming In-skill Purchasing Reusable Dialog
```
namespace com.example.skill.name

import com.amazon.alexa.skill.components.inSkillPurchase.purchase.buySpecificProduct 

dialog Nothing GameDialog {

dialog Nothing RideHailerDialog {
    sample {
        ...
        ...
        buySpecificProduct()
        ...
        ...
    }
}
```

*1.2. Invoke upsell RD in your existing ACDL dialog from where you want to promote a product to user.* 

Import and call [`upsell`](./docs/REFERENCE.md#upsell) 
ACDL Sample Example consuming In-skill Purchasing Reusable Dialog
```
namespace com.example.skill.name

import com.amazon.alexa.skill.components.inSkillPurchase.upsell.upsell

dialog Nothing GameDialog {

dialog Nothing RideHailerDialog {
    sample {
        ...
        ...
        upsell(upsellMessage, productName)
        ...
        ...
    }
}
```

*1.3. Invoke cancel RD in your existing ACDL dialog from where you want to allow user to cancel the purchase of any product.*

Import and call [`cancelPurchase`](./docs/REFERENCE.md#cancelPurchase) 
ACDL Sample Example consuming In-skill Purchasing Reusable Dialog
```
namespace com.example.skill.name

import com.amazon.alexa.skill.components.inSkillPurchase.cancel.cancelPurchase

dialog Nothing GameDialog {

dialog Nothing RideHailerDialog {
    sample {
        ...
        ...
        cancelPurchase()
        ...
        ...
    }
}
```

*1.4. Invoke resume RD in your existing ACDL dialog from where you want to resume the skill after purchase/cancel/upsell is finished.*

Import and call [`resumeAfterPurchase`](./docs/REFERENCE.md#resumeAfterPurchase) 
ACDL Sample Example consuming In-skill Purchasing Reusable Dialog
```
namespace com.example.skill.name

import com.alexa.reusable.component.inSkillPurchase.resume.resumeAfterPurchase

dialog Nothing GameDialog {

dialog Nothing RideHailerDialog {
    sample {
        ...
        ...
        buySpecificProduct()
        ...
        resumeAfterPurchase()
        ...
        ...
    }
}
```

### 5. Setup API Handlers

**1. Register API handlers**

Import the API handlers  into your main Lambda index file.

**TypeScript**
```
import { InSkillPurchase } from '@alexa-skill-components/in-skill-purchase';

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
         // your existing handler declarations
         ...InSkillPurchase.createHandlers(),
    )
    .withApiClient(new DefaultApiClient()) // for monetizationServiceClient
    .lambda();
```

**JavaScript**
```
const isp = require('@alexa-skill-components/in-skill-purchase')
const DefaultApiClient = require('ask-sdk-core').DefaultApiClient;

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        // your existing handler declarations
       ...isp.InSkillPurchase.createHandlers()
    )
    .withApiClient(new DefaultApiClient()) // for monetizationServiceClient
    .lambda();
```

### 6. Compile and deploy your Skill

Build your skill as one would normally; the component's dialogs samples and API handlers (that were integrated into
the skill) will be built along-side your skill's own custom dialog samples and handlers.

```
askx compile && askx deploy
```

Note that a Alexa Conversations skill deployment can take 20-40 minutes to complete.

### 7. Test your Skill.
To do so via CLI, you can run the following:
```
askx dialog -s <YOUR_SKILL_ID> -l en-US -g development
```
Or you can use the Developer Console via the "Test" tab to simulate apart from your Alexa device.  

### 8. Iterate

After testing the default behavior of the component, look into the [reference doc](./docs/REFERENCE.md) to see possible customizations to suit your use case. 

To deploy any changes, run compile and deploy again:
```
askx compile && askx deploy
```
## Reference

Details on all dialogs can be found in the [Reference doc](./docs/REFERENCE.md)

## Got Feedback?

We are always improving our experiences for you and welcome your candid feedback. Connect with us on [here](https://github.com/alexa/skill-components#support)





