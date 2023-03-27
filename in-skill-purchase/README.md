<h1 align= "center"> In-Skill Purchasing Skill Component </h1>

Gather feedback on interactions to help drive skill development.

**Please note**: Alexa Skill Components are provided as a pre-production
alpha release in developer preview with limited support. Our goal is to
solicit feedback on our approach and design building towards their
broader general availability in the future. While we will make every
effort to minimize it, we do not make any backwards compatibility or
rapid turn-around bug-fix promises with this pre-production alpha
release. You can [sign up for the developer
preview](https://build.amazonalexadev.com/2022-Skill-Components-Interest.html)
to use these components.

Amazon is actively making updates to these components and looks forward
to your feedback. Check back to get the latest version.

[Sign up to join
us](https://build.amazonalexadev.com/2022-Skill-Components-Interest.html)
in our effort to help you build more engaging Alexa skills faster!

Table of Contents
-----------------

-   [Introduction](https://github.com/alexa/skill-components/tree/main/in-skill-purchase#introduction)
    -   [When should I use this
        component?](https://github.com/alexa/skill-components/tree/main/in-skill-purchase#when-should-i-use-this-component)
    -   [Example
        Interaction](https://github.com/alexa/skill-components/tree/main/in-skill-purchase#example-interaction)
-   [Getting
    Started](https://github.com/alexa/skill-components/tree/main/in-skill-purchase#getting-started)
-   [Reference](https://github.com/alexa/skill-components/tree/main/in-skill-purchase#reference)

Introduction
------------

[In-skill
purchasing](https://developer.amazon.com/en-US/docs/alexa/in-skill-purchase/isp-overview.html)
(ISP) lets you sell premium digital content, such as hints in a trivia
skill or additional lives in custom skills. ISP supports three payment
models: one-time purchases, consumables, and subscriptions. The ISP
skill component lets you add in-skill purchasing workflow to your skill
as a pre-built voice experience. At this time, the component supports
subscriptions only. Subscriptions offer access to premium content or
features for a period of time, charged on a recurring basis until the
user cancels the subscription.

Alexa Skill Components encapsulate best customer experience design
practices to reduce your development time. To learn more about Skill
Components, see Alexa Skill Components Getting Started.

### When should I use this component?

Are you building an app in which you would like the customer to add the
in-skill purchasing workflow into the skill, which lets Alexa Skill
developers to sell premium content, such as game features or any other
subscription in custom skills. Use the pre-built interaction patterns
within the In-Skill Purchase Component to build out and customize such
interactions.

### Example Interaction

The following interactions show a skill that offers three types of
in-skill products: value subscription, premium subscription, and elite
subscription.

The following example shows a purchase suggestion.
```
User > What can I buy?

Alexa > With our value subscription, you can access 45+ mindful
sessions; with our premium subscription, you can add 150+ guided
workouts, and with our elite subscription, you can set up dedicated
sessions with our certified trainers. Which one would you like to learn
more about?

User > Tell me more about the elite subscription

Alexa > Elite subscription is free for 7 days. Then, you’ll be
charged \$0.99 a month plus tax. Cancel anytime. Check the Alexa app for
terms. Should I start your free trial?

User > Yes

Alexa > Great! You're signed up.

```
The following example shows a cancellation.
```
User > Cancel elite subscription

Alexa > Okay! As a reminder, with elite subscription you can set up
dedicated sessions with our certified trainers. Are you sure you want to
cancel your subscription?

User > Yes

Alexa > Okay, I've canceled elite subscription, and you'll no longer
be charged. You can continue to use it until the end of this
subscription period.

```

Getting Started
---------------

### To get started with the ISP skill component, complete the following steps.

### Familiarize yourself with Alexa Skill Components.

Read the [Skill Components Getting Started
guide](https://github.com/alexa/skill-components/blob/main/README.md#getting-started).
If you're unfamiliar with skill development, the [flight search example
skill
tutorial](https://developer.amazon.com/en-US/docs/alexa/workshops/acdl-flightsearch-tutorial/get-started/index.html)
is a good starting place.

### Add in-skill purchase products to your existing skill.

a.  Make sure that you have an existing ACDL Alexa Skill or [Get Started
    with ACDL Alexa
    Skill](https://developer.amazon.com/en-US/docs/alexa/conversations/acdl-get-started.html) 
    
b.  [Create and Manage In-Skill
    Products](https://developer.amazon.com/en-US/docs/alexa/in-skill-purchase/create-isp-dev-console.html)
    
**Note**: For this version Amazon supports the subscription payment model only.

### Install the ISP skill component in your skill.

Make sure that the package.json file exists in the skill's root
directory. You can create a package.json file with the following
command:
```
npm init

```

You can install the component from the public release or a local build
of the component.

**Public Release**

1.  In your skill's root directory, install using npm.

```
npm install --save @alexa-skill-components/in-skill-purchase
npm install

```

2.  Install the component as a dependency in your API code (AWS
    Lambda function).
    
```
npm install --save @alexa-skill-components/in-skill-purchase
npm install

```

**Local Build**

1.  In a separate directory from your skill, build the component
    from source.

```
git clone git@github.com:alexa/skill-components.git
cd skill-components
cd in-skill-purchase
npm run clean-build

```

2.  In your skill's root directory, use npm to install the local build.

```
npm install --save "&lt;path>/skill-components/in-skill-purchase"
npm install

```

3.  Install the component as a dependency in your API code (AWS Lambda
    function):

```
npm install --save "&lt;path>/skill-components/in-skill-purchase"
npm install

```

### Call the reusable dialog

1\. Invoke the purchase suggestion dialog in your existing ACDL dialog.
Choose where you want to direct the user to select a product or start
the purchase flow with a product specified. To do this, import the ISP
component, and then call
[buySpecificProduct](https://github.com/alexa/skill-components/blob/main/in-skill-purchase/docs/REFERENCE.md#buySpecificProduct).
The following example code shows the purchase dialog invocation.

```
namespace com.example.skill.name

import com.amazon.alexa.skill.components.in_skill_purchase.purchase.buySpecificProduct 

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

2\. Invoke the upsell reusable dialog in your existing ACDL dialog at the
point where you want to promote a product to user. To do this, import
the ISP component, and then call
[upsell](https://github.com/alexa/skill-components/blob/main/in-skill-purchase/docs/REFERENCE.md#upsell)
. The following example code shows the upsell dialog invocation.

```
namespace com.example.skill.name

import com.amazon.alexa.skill.components.in_skill_purchase.upsell.upsell

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

3\. Invoke the cancel reusable dialog in your existing ACDL dialog at the
point where you want to allow the user to cancel the purchase of any
product. To do this, import the ISP component, and then call
[cancelPurchase](https://github.com/alexa/skill-components/blob/main/in-skill-purchase/docs/REFERENCE.md#cancelPurchase).
The following example code shows the cancel dialog invocation.

```
namespace com.example.skill.name

import com.amazon.alexa.skill.components.in_skill_purchase.cancel.cancelPurchase

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

4\. Invoke the resume reusable dialog in your existing ACDL dialog at the
point where you want to resume the skill after the purchase, cancel, and
upsell dialogs complete. To do this, import the ISP component, and then
call
[resumeAfterPurchase](https://github.com/alexa/skill-components/blob/main/in-skill-purchase/docs/REFERENCE.md#resumeAfterPurchase).
The following example code shows the resume dialog invocation.

```
namespace com.example.skill.name

import com.alexa.reusable.component.in_skill_purchase.resume.resumeAfterPurchase

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

### Setup API Handlers

**1. Register API handlers**

Import the API handlers  into your main Lambda index.js file.

**TypeScript**
```
import { in_skill_purchase } from '@alexa-skill-components/in-skill-purchase';

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
         // your existing handler declarations
         ...in_skill_purchase.createHandlers(),
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
       ...isp.in_skill_purchase.createHandlers()
    )
    .withApiClient(new DefaultApiClient()) // for monetizationServiceClient
    .lambda();
```

### Compile and deploy your Skill.

Build your skill as normal. The component's dialogs samples and API
handlers that you integrated into the skill are built along-side your
skill's own custom dialog samples and handlers. To build and deploy your
skill, run the following command:

```
askx compile && askx deploy
```

**Note**: An Alexa Conversations skill deployment can take 20-40 minutes to
complete.

### Test your Skill.

To simulate your Alexa device, you can test your skill in the Alexa
Developer Console on the **Test** tab Or, you can test your skill by
using the Alexa Skills Kit CLI.

To test your skill by using the CLI, run the following command:
```
askx dialog -s <YOUR_SKILL_ID> -l en-US -g development

```

### Iterate on the reusable dialogs

After you test the default behavior of the component, you can customize
the ISP component. For details about customizations, see [ACDL Reusable
Dialogs
reference](https://github.com/alexa/skill-components/blob/main/in-skill-purchase/docs/REFERENCE.md).

To compile and deploy changes, run the following command:

```
askx compile && askx deploy
```

Reference
---------

Details on all dialogs can be found in the [Reference
doc](https://github.com/alexa/skill-components/blob/main/in-skill-purchase/docs/REFERENCE.md)

Got Feedback?
-------------

Amazon welcomes your feedback. Connect with us on
[here](https://github.com/alexa/skill-components#support).

License
-------

Copyright 2022 Amazon.com, Inc., or its affiliates. All rights reserved.
You may not use this file except in compliance with the terms and
conditions set forth in the accompanying [LICENSE](https://github.com/alexa/skill-components/blob/main/LICENSE) file. THESE MATERIALS
ARE PROVIDED ON AN "AS IS" BASIS. AMAZON SPECIFICALLY DISCLAIMS, WITH
RESPECT TO THESE MATERIALS, ALL WARRANTIES, EXPRESS, IMPLIED, OR
STATUTORY, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
