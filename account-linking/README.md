<body>

<h1 align= "center"> Account Linking Skill Component </h1>

<details>
  <summary>Table of contents</summary>
  <ol>
     <ul>
    <li><a href="#getting-started">Getting started</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#contributions">Contributions</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#related-topics">Related topics</a></li>
    </ul>
  </ol>
</details>

**NOTE:**  Alexa skill components are offered as a pre-production alpha release in developer preview. Support at this stage is limited. Our goal is to elicit feedback on our approach and design as we build toward general availability. Although we make every effort to maximize backward compatibility of this release, we can't promise it, nor can we guarantee a rapid turnaround on bug fixes. Amazon is actively updating the skill components, however, and we look forward to your feedback. Check back often to get the latest version of the components. [Sign up to join us](https://build.amazonalexadev.com/2022-Skill-Components-Interest.html) in our effort to help you build more engaging Alexa skills faster!

***

Pre-made Alexa skill components help you develop high-quality Alexa skills quickly. You can use the account linking reusable skill component to enhance any skill that requires a [linked account](https://developer.amazon.com/en-US/docs/alexa/smapi/account-linking-operations.html). The reusable dialog validates whether a user's account is already linked in an existing ACDL skill. It checks for an access token from a linked account, automatically prompting the user to set up an account link if necessary. 

<p style="text-align:right">(<a href="#top">Back to top</a>)</p>

## Getting started

The account linking skill component works with Alexa Conversations skills created on the command line with the Alexa Conversations Description Language (ACDL) (beta). When you create your skill, you write sample conversations, or [dialogs](https://developer.amazon.com/en-US/docs/alexa/conversations/acdl-dialogs.html), and use the [Alexa Skills Kit Command Line Interface (ASK CLI)](https://developer.amazon.com/en-US/docs/alexa/conversations/acdl-set-up-ask-cli.html) to [build and deploy your skill](https://developer.amazon.com/en-US/docs/alexa/conversations/acdl-tutorial-create-skill.html). 

These sample dialogs represent the various conversational experiences your skill supports. Alexa Conversations [uses a dialog simulator](https://developer.amazon.com/de-DE/docs/alexa/conversations/acdl-using.html) to expand your annotated dialogs into variants that train the dialog management model. The Alexa Conversations runtime hosts the trained model to process incoming [events](https://developer.amazon.com/de-DE/docs/alexa/conversations/acdl-using-events.html) and predict [actions](https://developer.amazon.com/de-DE/docs/alexa/conversations/acdl-using-actions.html).

**NOTE:**  Alexa Conversations Description Language (ACDL) is offered as a beta and may change as we receive feedback and iterate on the feature.

<p style="text-align:right">(<a href="#top">Back to top</a>)</p>

## Features

The account linking skill component simplifies the account linking development process in several ways.

* Checks the user's access token and automatically prompts the user to link their account if necessary
* Generates speech that briefly explains the benefits of account linking
* On multimodal devices, displays a default Alexa presentation language (APL) screen
* Sends a "Link account" card to the Alexa companion app on the user's mobile device

<p style="text-align:right">(<a href="#top">Back to top</a>)</p>

## Prerequisites

Before you start, you need an Amazon developer account. You can use an existing Amazon account to sign in, or you can [create a new account](../ask-overviews/create-developer-account.html). The account is free. 

Log in to the [Alexa developer console](https://developer.amazon.com/alexa/console/ask), and make sure you meet the following other prerequisites. 

* The ASK CLI is installed.<br>
If not, run the following command to install it. 
```
$ npm install -g ask-cli
```
* The ASK CLI is [configured](https://developer.amazon.com/en-US/docs/alexa/smapi/quick-start-alexa-skills-kit-command-line-interface.html).<br>

* You have an [Alexa skill that uses ACDL](https://developer.amazon.com/en-US/docs/alexa/workshops/acdl-flightsearch-tutorial/get-started/index.html).<br>
To create a new ACDL skill, see [Tutorial: Create an Alexa Conversations Skill with the ACDL](https://developer.amazon.com/en-US/docs/alexa/conversations/acdl-tutorial-create-skill.html).
* Account linking is enabled for your skill.<br>
You can [configure your options in the developer console](https://developer.amazon.com/en-US/docs/alexa/account-linking/steps-to-implement-account-linking.html#step-2-configure-account-linking-in-the-developer-console).
* The [ASK SDK v2.11.0](https://www.npmjs.com/package/ask-sdk) or higher is installed.<br> 
If not, to install it, run the following command.
```
$ npm install --save ask-sdk
```
* The `npm` cache is empty.<br>
To clear the cache, run the following command.
```
$ npm install -g n
```
* The latest version of Node.js is installed.<br> 
To update Node.js, run the following command.
```
$ n latest
```
* You have the latest version of `npm`.<br>
To update `npm`, run the following command.
```
$ npm install -g npm@latest
```
* (_Optional_) The latest version of Typescript (version 4.1.2 or higher) is installed.<br>
To update Typescript, enter the following command.
```
$ npm install -g typescript@next
```

<p style="text-align:right">(<a href="#top">Back to top</a>)</p>

## Installation

### Step 1: [Add the account linking reusable dialog](https://developer.amazon.com/en-US/docs/alexa/conversations/acdl-reusable-dialogs.html) as a dependency
<br>

 **To install the dependency using `npm`**

```
$ npm i @alexa-skill-components/account-linking

```

**To install the dependency using your `package.json` file**

```
{
"dependencies":
{ "@alexa-skill-components/account-linking": "*" }
}
```
The resulting `package.json` file might look similar to the following example.
```
{
  "types": "dist/index.d.ts",
  "files": [
    "dist/*",
    "interactionModels/*",
    "response/*",
    "build"
   ]
  "dependencies": {
    "@alexa-skill-components/account-linking": "*"
    "@aws-sdk/client-dynamodb": "^3.199.0",
    "@aws-sdk/util-dynamodb": "^3.199.0",
    "@types/node": "^18.8.4",
    "ask-sdk-core": "^2.10.1",
    "ask-sdk-model": "^1.39.0",
    "lodash": "^4.17.15",
    "uuid": "^8.3.2"  
   }
}
```
### Step 2: Install account linking reusable dialog package dependencies
<br>

**To install package dependencies**

From the root of your skill package, run the following command.

```
$ npm install 
```

### Step 3: Invoke the reusable dialogs
<br>

**To invoke the account linking reusable dialog in your skill**<br>

In your existing ACDL dialog, mark the point at which you want to validate account linking. To do so, supply a customized Alexa presentation language (APL) and APLA (APL-audio) prompt document that indicates how Alexa should respond if account linking is not set up or configured correctly. The following is an example prompt.

```
You need a ride hailer account to order a ride. Open the Alexa app and click the link to connect to your ride hailer account.
```

The following example is a reusable dialog associated with the ride hailer use case. 
```
namespace com.example.skill.name

import com.amazon.alexa.skill.components.account_linking.required.validateAccountIsLinked
import prompts.AccountLinkingRequiredAPLAPrompt
import prompts.AccountLinkingRequiredAPLPrompt

dialog Nothing RideHailerDialog {
    sample {
        ...
        ...
        defResponse = MultiModalResponse {
            apla =  AccountLinkingRequiredAPLAPrompt,
            apl = AccountLinkingRequiredAPLPrompt
        }
        validateAccountIsLinked(defResponse)
        ...
        ...
    }
}
```

### Step 4: Compile and deploy the skill
<br>

**To compile your ACDL skill**<br>

From the root directory of your skill package, run the following command.

```
$ askx compile 
```

**To deploy your ACDL skill**<br>

From the root directory of your skill package, run the following command.

```
$ askx deploy 
```

### Step 5: Modify your AWS Lambda methods
<br>

**To modify your AWS Lambda index.js file in Javascript**<br>

In your main AWS Lambda index file, import the `GetAccountLinkingStatusHandler`. The following example shows how to import `@alexa-skill-components/account-linking`. 

```
const accountLinking = require('@alexa-skill-components/account-linking');

exports.handler = Alexa.SkillBuilders.custom()
.addRequestHandlers(
new accountLinking.GetAccountLinkingDetailsHandler(),
)
.lambda();
```

**(_Optional_) To modify your AWS Lambda index.ts file in Typescript**<br>

In your `index.ts` file, use the following syntax to modify your AWS Lambda methods.

```
import { GetAccountLinkingDetailsHandler } from "@alexa-skill-components/account-linking"

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        new GetAccountLinkingDetailsHandler(),
        ....
    )
    .lambda();
```

<p style="text-align:right">(<a href="#top">Back to top</a>)</p>

## Contributions

Amazon wants to continually improve the customer experience, and we welcome your candid feedback. Connect with us on our [Slack channel](https://alexa.design/slack) to share your thoughts.

Check back here often to get the latest instance of the account linking reusable dialog skill component.

<p style="text-align:right">(<a href="#top">Back to top</a>)</p>


## License

Copyright 2022 Amazon.com, Inc., or its affiliates. All rights reserved. You may not use this file except in compliance with the terms and conditions set forth in the accompanying LICENSE file. THESE MATERIALS ARE PROVIDED ON AN "AS IS" BASIS. AMAZON SPECIFICALLY DISCLAIMS, WITH RESPECT TO THESE MATERIALS, ALL WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

<p style="text-align:right">(<a href="#top">Back to top</a>)</p>

## Related topics

* [Get Started with the Alexa Conversations Description Language](https://developer.amazon.com/en-US/docs/alexa/conversations/acdl-get-started.html)
* [Alexa Skills Kit Toolkit for VS Code](https://marketplace.visualstudio.com/items?itemName=ask-toolkit.alexa-skills-kit-toolkit)
* [Test Skills in Visual Studio Code](https://developer.amazon.com/en-US/docs/alexa/ask-toolkit/vs-code-testing-simulator.html)

<p style="text-align:right">(<a href="#top">Back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/alexa/skill-components/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/alexa/skill-components/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/alexa/skill-components/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/alexa/skill-components/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/alexa/skill-components/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555

 </body>