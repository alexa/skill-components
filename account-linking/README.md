Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved. You may not use this file except in compliance with the terms and conditions set forth in the accompanying LICENSE.TXT file. THESE MATERIALS ARE PROVIDED ON AN "AS IS" BASIS. AMAZON SPECIFICALLY DISCLAIMS, WITH RESPECT TO THESE MATERIALS, ALL WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.


# Introduction

Alexa Skill Components encapsulate best customer experience (CX) design practices to reduce your development time. You can use the Account Linking Reusable Skill Component to enhance any existing skills that require a linked account to enable the skill. The reusable dialog checks for the access token from a linked account, automatically prompting the user to link their account, if necessary. In particular, the Component will:

* Generate speech that briefly explains the benefits of linking accounts (as per developer’s customization)
* Displays a default APL screen on multimodal device
* Sends a ‘link account card’ to the user’s Alexa companion app on their mobile device

### Pre-requisite 

1. Any existing ACDL Alexa Skill or [Get Started with ACDL Alexa Skill](https://developer.amazon.com/en-US/docs/alexa/conversations/acdl-get-started.html). 
2. [Configure Account Linking in the developer console for your skill](https://developer.amazon.com/en-US/docs/alexa/account-linking/steps-to-implement-account-linking.html#step-2-configure-account-linking-in-the-developer-console)
3. [ASK Developer Console](https://developer.amazon.com/alexa/console/ask) and ASK-CLI-X (https://www.npmjs.com/package/ask-cli-x)
4. [ASK SDK v2.11.0](https://www.npmjs.com/package/ask-sdk)
5. NodeJS and NPM

### Optional

* [Alexa Skills Kit Toolkit for VS Code](https://marketplace.visualstudio.com/items?itemName=ask-toolkit.alexa-skills-kit-toolkit)
* [Local Debug](https://developer.amazon.com/en-US/docs/alexa/ask-toolkit/vs-code-testing-simulator.html) using VSCode
* TypeScript - 3.9.9

# Installation

*NOTE: This runbook is for the CLI users who want to use account linking reusable dialog to validate if their users have their accounts already linked in their existing ACDL Skill CX.*

## Steps at a Glance

* Step 1. Add Account Linking Reusable Dialog as dependency
* Step 2. Update your existing skill to Invoke Account Linking Reusable Dialog 
* Step 3. Modify Lambda Methods

Step 1: Add Account Linking reusable dialog as dependency

*1. On your existing ACDL skill, install the Skill Component in the Custom side of your Skill package.*

* Use npm to install the dependencies.

npm i @alexa-components/account-linking-reusable-component

* Alternatively, on your existing ACDL skill packages, you can add account linking RD component as dependencies inside package.json file as shown below

```
{
    // your existing package.json content
    "dependencies": {
        // your existing package dependencies
        "@alexa-components/account-linking-reusable-component": "*"
    }
} 
```
* Install account linking RD package dependencies in your package by running `$npm install` command from root of your skill-package.

Step 2 : Update your existing skill to Invoke Reusable Dialog

*1. Invoke account linking required RD sample in your existing ACDL dialog from where you want to validate the account linking check.* 

* For example highlighted text is the invocation of the account linking RD. You will need to provide the customized APLA prompt document which you would like to respond to customer in case when account linking is not setup/or correctly configured. 
* Example prompt message: You need a Ride Hailer account to order a ride. Open your Alexa app and click the link to connect to your Ride Hailer account.

ACDL Sample Example consuming Account Linking Reusable Dialog
```
namespace com.example.skill.name

import com.amazon.alexa.accountlinking.required.AccountLinkingRequiredRD
import prompts.AccountLinkingRequiredPrompt

dialog Nothing RideHailerDialog {
    sample {
        ...
        ...
        AccountLinkingRequiredRD(AccounLinkingRequiredPrompt)
        ...
        ...
    }
}
```
2. Compile the ACDL skill by running  $ askx compile  command from root directory of the skill-package

Note: If compilation failed, fix the errors as per the error description message. You can find some of the common errors https://quip-amazon.com/c491AKmn9bfn/Account-Linking-Reusable-Dialog-Run-book#temp:C:PUd85583ac5582a44cbab8340c50

3. Once compiled successfully, deploy the skill by running  $ askx deploy  command from root directory of the skill-package.

Step 3 : Modify Lambda Methods.

1. Import the GetAccountLinkingStatusHandler  into your main Lambda index file.

*Javascript:* In index.js, an example to import @alexa-components/account-linking-reusable-component
```
const accountLinking = require('@alexa-components/account-linking-reusable-component');

exports.handler = Alexa.SkillBuilders.custom()
 .addRequestHandlers(
 // your existing handler declarations
    new accountLinking.GetAccountLinkingDetailsHandler(),
 )
 .lambda();
```
*Typescript:* In index.ts, use this syntax instead for the importing.
```
import { GetAccountLinkingDetailsHandler } from "@alexa-components/account-linking-reusable-component"

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        // your existing handler declarations
        new GetAccountLinkingDetailsHandler(),
        ....
    )
    .lambda();
```
## Future Components

We are continuously working on upgrading the Account Linking Reusable Dialog Skill Component with a more robust VUI and multimodal elements. We want to ensure our experiences maximize interactivity with Alexa devices with screens, and we will update with new features, such as account linking as an optional flow in the skill experience.
Check out for new npm updates to obtain the latest instance of the Account Linking Reusable Dialog Skill Component package. 


## Got Feedback?

We are always improving our experiences for you and welcome your candid feedback. Connect with us on our Slack Channel (https://alexa.design/slack)! - We need to create one for our reusable dialog
