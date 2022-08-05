<p align="center">
  <img src="https://m.media-amazon.com/images/G/01/ask/SkillComponents/skillcomp_feedback._CB631945186_.png">
  <br/>
  <h1 align="center">Feedback Elicitation Skill Component</h1>
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
* [Recipes](#recipes)
* [Reference](#reference)
* [Example skills](#example-skills)
* [Customer Experience Design Guidelines](#customer-experience-design-guidelines)
* [Known issues](#known-issues)

## Introduction
Alexa Skill Components encapsulate best customer experience (CX) design practices to reduce your development time. Learn more about Skill Components in the [Skill Components Getting Started guide](../README.md#getting-started). The Feedback Elicitation component provides functionality to collect user feedback about your skill, an interaction, or experience that your skill delivers. Use it to ask for feedback about the latest interaction your customer had, or to rate your skill in the Skill store, or to obtain feedback about a product or service your customer was interested in. 

### When should I use this component?
Are you building an app in which you would like to get feedback from customers? Do you need to build an interaction where they can give the feedback about the interaciton from the user? Use the pre-built interaction patterns within the Feedback Elicitation Skill Component to build out and customize such interactions.

### Example Interaction

The component is meant to be used at the end of a skill interaction; for instance the below interaction for the included [WeatherBot example skill](./examples/WeatherBot) shows how a skill using this component can present a result (weather info in this example) whilst requesting feedback about the interaciton from the user.

```
User  > What's the weather today in Seattle?
Alexa > In Seattle, it's a high of 68 degrees and a low of 55 degrees. Please rate this experience from 1-5, with 5 being the best
User  > four
Alexa > Thank you for the feedback! Glad that you enjoyed the experience.
```

## Getting Started

### 1. Familiarize yourself with Alexa Skill Components

Read [Skill Components Getting Started guide](../README.md#getting-started)

For those unfamiliar with skill development, the [flight search example skill tutorial](https://developer.amazon.com/en-US/docs/alexa/workshops/acdl-flightsearch-tutorial/get-started/index.html) is a good starting place.

### 2. Install component in your skill

Note that if a `package.json` file does not already exist in the skill's root directory, then one can be created with:
```
npm init
```

Install the component either from public release or a local build of the component:

**Public Release**

In your skill's root directory, install using npm:
```
npm install --save @alexa-skill-components/feedback-elicitation
npm install
```

Also install the component as a dependency in your API code (lambda):
```
npm install --save @alexa-skill-components/feedback-elicitation
npm install
```

**Local Build**

In a seperate directory from your skill, build component from source:
```
git clone git@github.com:alexa/skill-components.git
cd skill-components
cd feedback-elcitiation
npm run clean-build
```

then, in your skill's root directory, use npm to install the local build:
```
npm install --save "<path>/skill-components/feedback-elicitation"
npm install
```

Also install the component as a dependency in your API code (lambda):
```
npm install --save "<path>/skill-components/feedback-elicitation"
npm install
```

### 3. Call reusable dialog

Import and call the [`elicitRating`](./docs/REFERENCE.md#elicitrating) ACDL reusable dialog provided by this component from your skill's own custom sample dialogs; providing required arguments detailing how to notify user of prior API result (while requesting feedback at the same time).

**1. Import the component's reusable dialogs and types into you skill's ACDL**
```
namespace examples.weatherbot

import com.amazon.alexa.skill.components.feedback_elicitation.*
```

**2. Call the [`elicitRating`](./docs/REFERENCE.md#elicitrating) ACDL reusable dialog**
Identify a dialog sample in your skill and replace the last call to the [`response` action](https://developer.amazon.com/en-US/docs/alexa/conversations/acdl-accl-actions.html#response) with a call to the reusable dialog.

For example turning this:
```
response(
  response = weather_apla,
  act = Notify { actionName = getWeather },
  payload = ResponsePayload {weatherResult = weatherResult}
)
```
into this:
```
elicitRating(
    notifyResponse = weather_apla, 
    notifyAction = getWeather, 
    payload = ResponsePayload {weatherResult = weatherResult}
)
```

Refer to the [ACDL code for the WeatherBot example skill](./examples/WeatherBot/skill-package/conversations/Weather.acdl) for an example.

**3. Add rating prompt to your response**
Modify the response your now passing into the [`elicitRating`](./docs/REFERENCE.md#elicitrating) dialog to prompt the user for a rating value (in addition to what it was doing before); for example:

```
// prompts/weather_apla/document.json
{
  "type": "APL-A",
  ...
  "content": "In ${payload.weatherResult.cityName}, it's a high of ${payload.weatherResult.highTemp} degrees and a low of ${payload.weatherResult.lowTemp} degrees. Please rate this experience from 1-5, with 5 being the best."
  ...
}
```

### 4. Setup API Handlers

**1. Register API handlers**

Import and register the [`SaveRatingRequestHandler`](./docs/REFERENCE.md#saveratingrequesthandler) request handler provided by the component into the skill's API code (where it will live alongside the skill's other request handlers).

**TypeScript**
```
import { SaveRatingRequestHandler } from 
    '@alexa-skill-components/feedback-elicitation';

...

export const handler = SkillBuilders.custom()
    .addRequestHandlers(
        ...
        new SaveRatingRequestHandler(),
    )
    .lambda();
```

**JavaScript**
```
const FeedbackElicitation = require('@alexa-skill-components/feedback-elicitation')

...

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        ...
        new FeedbackElicitation.SaveRatingRequestHandler()
    .lambda();
```

Refer to the [TypeScript code for the WeatherBot example skill](./examples/WeatherBot/lambda/index.ts) for an example.

### 5. Compile and deploy your Skill

Build your skill as one would normally; the component's dialogs samples and API handlers (that were integrated into
the skill) will be built along-side your skill's own custom dialog samples and handlers.

```
askx compile && askx deploy
```

Note that a Alexa Conversations skill deployment can take 20-40 minutes to complete.

### 6. Test your Skill.
To do so via CLI, you can run the following:
```
askx dialog -s <YOUR_SKILL_ID> -l en-US -g development
```
Or you can use the Developer Console via the "Test" tab to simulate apart from your Alexa device.  

### 7. Iterate

After testing the default behavior of the component, look into the [reference doc](./docs/REFERENCE.md) to see possible customizations to suit your use case. 

By default, the component will simply record the ratings provided by users to the JavaScript Console log (ended up in AWS CloudWatch if using AWS Lambda); so you will probably want to create a custom [`RatingRecorder`](./docs/REFERENCE.md#rating-recorder) implementation to store the ratings into your own databases.

Also look through the [Recipes](#recipes), [Example Skills](#example-skills), and [CX Design Guidelines](#customer-experience-design-guidelines) for more information.

To deploy any changes, run compile and deploy again:
```
askx compile && askx deploy
```
## Recipes

* [Customize inform rating event](./docs/RECIPES.md#customize-inform-rating-event)
* [Customize rating validation](./docs/RECIPES.md#customize-rating-validation)
* [Customize the save rating response](./docs/RECIPES.md#customize-the-save-rating-response)
* [Save ratings to custom database](./docs/RECIPES.md#save-ratings-to-custom-database)
* [Gather rating without ending session](./docs/RECIPES.md#gather-rating-without-ending-session)

## Reference

Details on all dialogs and API handlers can be found in the [Reference doc](./docs/REFERENCE.md)

## Example Skills

* [WeatherBot](./examples/WeatherBot)
* [FlightBot](./examples/FlightBot)

## Customer Experience Design Guidelines

If customizing the default CX for this component, it's a good idea to follow some [design guidelines](./docs/CX_DESIGN_GUIDELINES.md).

## Known Issues

**Negative Rating Values**

Negative rating values provided by users are sometimes misinterpreted as valid values; for example:
```
Alexa > ... Please rate this experience from 1-5, with 5 being the best
User  > negative thirty
Alexa > Thank you for the feedback!
```
"negative thirty" can sometimes result in the [`RatingRecorder`](./docs/REFERENCE.md#rating-recorder) implementation being called with a value of '3'

**No return value on dialog**

The [`elicitRating`](./docs/REFERENCE.md#elicitrating) reusable dialog currently does not return the rating value the user provides.

