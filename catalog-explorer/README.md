<p align="center">
    <h1 align="center">Catalog Explorer Skill Component</h1>
</p>


With the Catalog Explorer Skill Component, you can enable users of your skill to easily search, navigate, select items, get properties, and perform actions through a catalog of items you provide. To use the Alexa Skill components, [sign up for the developer preview](https://build.amazonalexadev.com/2022-Skill-Components-Interest.html). We actively update these components and look forward to improving them with your feedback. To get the latest version, check back here often.

**Note:** Alexa Skill Components are provided as a pre-production alpha release in developer preview, with limited support. Our goal is to solicit feedback on our approach and design as we work toward general availability. While we make every effort to minimize issues with this pre-production alpha release, we can't promise backward compatibility or a rapid turn-around on bug fixes.

## Table Of Contents

* [Introduction](#introduction)
    * [When to use this component](#when-to-use-this-component)
    * [Example Interaction](#example-interaction)
* [Getting Started Process](#getting-started-process)
* [Reference](#reference)
* [Example skill](#example-skill)
* [Known issues](#known-issues)
* [Feedback](#feedback)
* [License](#license)

## Introduction

To reduce your development time, Alexa Skill Components are consistent with user experience best practices. The Catalog Explorer Skill Component lets users of your skill browse a catalog of items (books, movies, news articles, or recipes, for example). Users can search for, navigate through, and get details about catalog items. When they find an item of interest, they can take some action, such as buy, watch, or send to phone.

### When to use this component

Are you building an app in which your users search for or select items while navigating through a catalog? Do you want users to follow up on item's specific details and perform actions on the item? Use the pre-built interaction patterns within the Catalog Explorer Skill Component to build out and customize such interactions.

### Example interaction

Following is an example skill interaction that shows different paths a component user might follow. These  scenarios are taken taken from the included [Book Recommendation example skill](./examples/BookRecommendation).

#### New search

```
User  > Recommend a book by Stephen King.
Alexa > How about The Shining, by Stephen King, Under the Dome, by Stephen King, or It, by Stephen King?
User  > Recommend me a fantasy book by JK Rowling.
Alexa > How about Harry Potter: Deathly Hallows, by JK Rowling?
```

#### Refine search

```
User  > Recommend a book by Stephen King.
Alexa > How about The Shining, by Stephen King, Under the Dome, by Stephen King, or It, by Stephen King?
User  > I also want the book to be in the horror genre.
Alexa > How about The Shining, by Stephen King, It, by Stephen King, or Pet Sematary, by Stephen King?
```

#### Navigate the catalog

```
User  > Recommend a book for me.
Alexa > How about The Shining, by Stephen King, Dune, by Frank Herbert, or Hyperion, by Dan Simmons?
User  > Next.
Alexa > How about The Notebook, by Nicholas Sparks, The Hobbit, by JRR Tolkien, or A Game of Thrones, by George R.R. Martin?
User  > Go back.
Alexa > How about The Shining, by Stephen King, Dune, by Frank Herbert, or Hyperion, by Dan Simmons?
```

#### Select an item

```
User  > Recommend a book.
Alexa > How about The Notebook, by Nicholas Sparks, The Hobbit, by JRR Tolkien, or A Game of Thrones, by George R.R. Martin?
User  > The second one.
Alexa > The Hobbit, by JRR Tolkien, is a fantasy novel. Here's a summary: A hobbit, a wizard, and some dwarves go on an adventure.
```

#### Get property of a selected item

```
User  > Recommend a book.
Alexa > How about The Notebook, by Nicholas Sparks, The Hobbit, by JRR Tolkien, or A Game of Thrones, by George R.R. Martin?
User  > The second one.
Alexa > The Hobbit, by JRR Tolkien, is a fantasy novel. Here's a summary: A hobbit, a wizard, and some dwarves go on an adventure.
User  > What's the format?
Alexa > The format is audio.
```

#### Perform action on a selected item
```
User  > Recommend a book.
Alexa > How about The Notebook, by Nicholas Sparks, The Hobbit, by JRR Tolkien, or A Game of Thrones, by George R.R. Martin?
User  > The second one.
Alexa > The Hobbit, by JRR Tolkien, is a fantasy novel. Here's a summary: A hobbit, a wizard, and some dwarves go on an adventure.
User  > Save it for later.
Alexa > I saved the book for later.
```

## Getting Started Process

* [Step 1: Learn about Alexa Skill Components](#step-1-learn-about-alexa-skill-components)
* [Step 2: Install the Catalog Explorer component](#step-2-install-the-catalog-explorer-component)
* [Step 3: Call the reusable dialog](#step-3-call-the-reusable-dialog)
* [Step 4: Create a custom type](#step-4-create-a-custom-type)
* [Step 5: Create events, actions, and dialogs](#step-5-create-events-actions-and-dialogs)
* [Step 6: Create main dialog](#step-6-create-main-dialog)
* [Step 7: Configure InteractionModel](#step-7-configure-interactionmodel)
* [Step 8: Set up API handlers](#step-8-set-up-api-handlers)
* [Step 9: Initialize CatalogReference](#step-9-initialize-catalogreference)
* [Step 10: Compile and deploy](#step-10-compile-and-deploy)
* [Step 11: Test](#step-9-test)
* [Step 12: Iterate](#step-12-iterate)

### Step 1: Learn about Alexa Skill Components
Read the [Skill Components Getting Started Guide](https://github.com/alexa/skill-components#getting-started). If you're unfamiliar with skill development, the following example skills are a good starting place:
* [Hello World skill](https://developer.amazon.com/en-US/docs/alexa/custom-skills/tutorial-use-the-developer-console-to-build-your-first-alexa-skill.html)
* [Flight Search skill](https://developer.amazon.com/en-US/docs/alexa/workshops/acdl-flightsearch-tutorial/get-started/index.html)

### Step 2: Install the Catalog Explorer component

The next step is to install the Catalog Explorer Skill Component in your skill. If a `package.json` file doesn't already exist in the skill's root directory, create one with the following command.

```
npm init
```

Install the Catalog Explorer component from either the public release or a local build of the component.

#### Public release

In your skill's root directory, install using `npm`.

```
npm install --save @alexa-skill-components/catalog-explorer
npm install
```

Then install the component as a dependency in your API code (lambda).

```
npm install --save @alexa-skill-components/catalog-explorer
npm install
```

#### Local build

In a separate directory from your skill, build the Catalog Explorer component from source code.

```
git clone git@github.com:alexa/skill-components.git
cd skill-components
cd catalog-explorer
npm run clean-build
```

Then, in your skill's root directory, use `npm` to install the local build.

```
npm install --save "<path>/skill-components/catalog-explorer"
npm install
```

Also install the component as a dependency in your API code (lambda):

```
npm install --save "<path>/skill-components/catalog-explorer"
npm install
```

### Step 3: Call the reusable dialog

Import and call the Alexa Conversations Description Language (ACDL) reusable dialog. The dialog is provided by this component from your skill's own custom sample dialogs. Provide required arguments that describe how to notify the user of a prior API result while requesting feedback.

#### Import reusable dialogs and types

Import the component's reusable dialogs and types into your skill's ACDL.

```
namespace skill.book.recommendation

import com.amazon.alexa.skill.components.catalog_explorer.*
import com.amazon.alexa.skill.components.catalog_explorer.types.*
```

#### Create custom types

Create custom types for the catalog item. For an example, see the [BookRecommendation sample skill](./examples/BookRecommendation).

```
type BookItem {
  String title
  String genre
  String author
  String format
  String summary
  String label
}
```

### Step 4: Create a custom type

Create a custom type search to find search conditions that contain all the properties might exist in the search events.

```
type SearchConditions {
  optional AUTHOR author
  optional GENRE genre
  optional FORMAT format
}
```

### Step 5: Create events, actions, and dialogs
Create events, actions, and dialogs for the following components.

#### Search

**Event**

Add examples of typical utterances for a search, containing the slot types for each combination of search conditions.

```
searchEvent = utterances<SearchConditions>([
  "What should I read next?",
  "Recommend a book to me",
  "Recommend a book by {author}",
  "Recommend a {genre} book",
  "Recommend a {genre} book by {author}",
  "What is a good book on {format}?",
  "Recommend a {genre} book by {author} on {format}"
])
```

**Action**

Create the action called when a search utterance is detected.

```
action RecommendationResult<SearchConditions, BookItem> search_new(optional AUTHOR author, optional GENRE genre, optional FORMAT format, optional CatalogReference catalogRef)
```

**Dialog**

Create anonymous dialogs to be passed in to the Catalog Explorer component for different variations of each search event. Be sure to cover all the variations that occur in the utterance set.

```
dialog RecommendationResult<SearchConditions, BookItem> searchApiAdaptor(SearchConditions searchConditions, optional CatalogReference catalogRef) {
  sample {
    search(searchConditions.author, searchConditions.genre, searchConditions.format, catalogRef)
  }
}

dialog RecommendationResult<SearchConditions, BookItem> searchApiVariationsAdaptor(SearchConditions searchConditions, optional CatalogReference catalogRef) {
    sample {
        search(author = searchConditions.author, catalogRef = catalogRef)
    }
    sample {
        search(genre = searchConditions.genre, catalogRef = catalogRef)
    }
    sample {
        search(format = searchConditions.format, catalogRef = catalogRef)
    }
    sample {
        search(genre = searchConditions.genre, author = searchConditions.author, catalogRef = catalogRef)
    }
}
```

#### Navigation

**Event**

Create a set of typical navigation utterances users might try.

```
nextEvent = utterances<Nothing>([
    "next",
    "next one",
    "next item",
    "show me another one",
    "show me more"
])

prevEvent = utterances<Nothing>([
    "previous",
    "previous one",
    "previous one, please",
    "go back",
    "show me the previous one"
])

// first, second, third, etc: https://developer.amazon.com/en-US/docs/alexa/custom-skills/slot-type-reference.html#ordinal
selectByOrdinalEvent = utterances<OrdinalSlotWrapper>([
    "show item view on the {ordinal} one",
    "show me more about the {ordinal} one",
    "show me the {ordinal} one",
    "show me the {ordinal}",
    "the {ordinal}",
    "{ordinal}"
])

// number one, two, three, etc: https://developer.amazon.com/en-US/docs/alexa/custom-skills/slot-type-reference.html#number
selectByIndexEvent = utterances<IndexSlotWrapper>([
    "show item view on number {index}",
    "show me more about number {index}",
    "show me number {index}",
    "number {index}",
    "{index}"
])
```

**Action**

Create the action called when a navigation utterance is detected.

```
action RecommendationResult<SearchConditions, BookItem> getPage(SearchConditions searchConditions, Optional<String> pageToken, optional CatalogReference catalogRef)
action RecommendationResult<SearchConditions, BookItem> selectItemApi(SearchConditions searchConditions, Page<BookItem> page, Number index, optional CatalogReference catalogRef)
```

**Dialog**

Create typical dialogs users might try to call in built-in search paths based on the number of search events declared in the skill. Be sure to update `N` with the number of search events defined in the skill.


```
dialog RecommendationResult<SearchConditions, BookItem> allSearchPathsAdaptor(PropertyConfig<SearchConditions, BookItem> config, optional CatalogReference catalogRef) {
    sample {
        allSearchPaths_{N}(config, catalogRef)
    }
}

dialog RecommendationResult<SearchConditions, BookItem> baseSearchPathsAdaptor(PropertyConfig<SearchConditions, BookItem> config, optional CatalogReference catalogRef) {
    sample {
        baseSearchPaths_{N}(config, catalogRef)
    }
}
```

#### Accept/reject offer

**Event**

Create a set of utterances users might try in order to accept or reject an offer.

```
yesEvent = utterances<Nothing>([
    "yes", "yeah", "sure", "that would be good"
])

noEvent = utterances<Nothing>([
    "no", "nah", "nope", "not feeling it"
])
```

**Action**

Create the action called when an "accept" utterance is detected.

```
action CatalogOfferResult acceptAction(List<BookItem> books, ProactiveOffer offer, optional CatalogReference catalogRef)
```

**Note:** Common "deny" utterances, such as "no" and "nope," work correctly only if you override the [built-in simulator handling](https://w.amazon.com/bin/view/Digital/Alexa/Conversations/ACDL/Internal/RunBook/#HCan27tmodel22no22utteranceforDenyevent) for the deployed skill.

#### Follow up

**Event**

Create a set of utterances users might try in order to follow up on properties.

```
 titlePropertyEvent = utterances<Nothing>([
    "What is the title?",
    "What is it called?",
    "what's the name of the book?",
    "what's the name?",
    "tell me the title"
])
```

**Action**

Create the action called when a follow-up utterance is detected

  ```
  action PropertyValueResult<BookItem> getProperty_title(List<BookItem> books, optional CatalogReference catalogRef)
  ```

**Dialog**

Create anonymous dialogs to be passed in to the component for different follow-up variations. Be sure to update `N` with the number of properties the skill follows up on (properties for which utterance sets are defined).

  ```
  dialog RecommendationResult<SearchConditions, BookItem> allFollowUpPathsAdaptor(PropertyConfig<SearchConditions, BookItem> config, RecommendationResult<SearchConditions, BookItem> priorResult, optional CatalogReference catalogRef) {
      sample {
          allFollowUpPaths_{N}(config, priorResult, catalogRef)
      }
  }
  ```

#### Perform action

**Event**

Create a set of utterances users might try in order to make a purchase.

```
 purchaseActionEvent = utterances<Nothing>([
    "buy it",
    "purchase",
    "get it for me"
])
```

**Action**

Create the action called when a follow-up utterance is detected.

```
action CatalogActionResult performAction_Purchase(List<BookItem> books, optional CatalogReference catalogRef)
```

**Dialog**

Create anonymous dialogs to be passed in to the component for different variations of an action event. Be sure to update this `N` with the number of actions performed in the skill (actions for which utterance set are defined).

```
dialog CatalogActionResult allCatalogActionPathsAdaptor(PropertyConfig<SearchConditions, BookItem> config, List<BookItem> items, optional CatalogReference catalogRef) {
    sample {
        allCatalogActionPaths_{N}(config, items, catalogRef)
    }
}
```

### Step 6: Create main dialog

```
dialog MainDialog{
    sample {
        newSearch = buildSearchPattern<SearchConditions, BookItem>(
            searchEvent = searchEvent,
            searchApiRef = search_new,
            searchApiAdaptor = searchApiAdaptor,
            searchApiVariationsAdaptor =  searchApiVariationsAdaptor
        )

        searchPatterns = [
            newSearch,
            //Add all other search dialogs to be used in skill
        ]

        navigationConfig = buildNavigationConfig<SearchConditions, BookItem>(
            nextEvent = nextEvent,
            prevEvent = prevEvent,
            getPageApi = getPage,
            selectByOrdinalEvent = selectByOrdinalEvent,
            selectByIndexEvent = selectByIndexEvent,
            selectItemApi = selectItemApi
        )

        catalogOffers = buildCatalogOffers<SearchConditions, BookItem>(
            acceptEvent = yesEvent,
            acceptAction = acceptAction,
            denyEvent = noEvent
        )

        titleProperty = buildCatalogProperty<BookItem>(
            getValueEvent = titlePropertyEvent,
            getValueApi = getProperty_title,
        )

        catalogProperties = [
            titleProperty,
            //Add all other follow-up property configurations to be used in skill
        ]

        purchaseAction = buildCatalogAction<BookItem>(
            actionEvent = purchaseActionEvent,
            performApi = performAction_Purchase
        )

        catalogActions = [
            purchaseAction,
            //Add all other perform action configurations to be used in skill
        ]
        
        //Build the main configuration object passed into the component
        config = buildCatalogConfig<SearchConditions, BookItem>(
            searchPatterns,
            navigationConfig,
            catalogProperties,
            catalogActions,
            catalogOffers,
            allSearchPathsAdaptor,
            baseSearchPathsAdaptor,
            allFollowUpPathsAdaptor,
            allCatalogActionPathsAdaptor
        )

        result = exploreCatalog<SearchConditions, BookItem>(config)
    }
}
```
### Step 7: Configure InteractionModel

Add all the possible slots types and slot values for the Search Conditions in the InteractionModel of the skill.

```
{
    "interactionModel": {
      "languageModel": {
        ...
        "types": [
          {
            "name": "GENRE",
            "values": [
              {
                "name": {
                  "value": "romance",
                  "synonyms": [
                    "love",
                    "courtship",
                    "lovey dovey"
                  ]
                }
              },
              {
                "name": {
                  "value": "horror",
                  "synonyms": [
                    "scary"
                  ]
                }
              }
              ...
            ]
          },
          {
            "name": "AUTHOR",
            "values": [
              {
                "name": {
                  "value": "Author1"
                }
              },
              {
                "name": {
                  "value": "Author2"
                }
              }
              ...
            ]
          },
          {
            "name": "FORMAT",
            "values": [
              {
                "name": {
                  "value": "electronic reader",
                  "synonyms": [
                    "kindle",
                    "E reader"
                  ]
                }
              },
              {
                "name": {
                  "value": "physical",
                  "synonyms": [
                    "paper",
                    "paperback",
                    "hardback"
                  ]
                }
              }
              ...
            ]
          }
          ...
        ]
      }
    }
  }
```

### Step 8: Set up API handlers

Import and register the request handlers provided by the component into the skill's API code (where it will live along with the skill's other request handlers).

#### TypeScript

  ```
  import { CatalogExplorer } from 
      '@alexa-skill-components/catalog-explorer';

  ...

  export const skillDomain = "skill.book.recommendation";

  export const handler = SkillBuilders.custom()
      .addRequestHandlers(
          ...
          ...CatalogExplorer.createHandlers(
              `${skillDomain}.getPage`,
              `${skillDomain}.selectItemApi`,
              `${skillDomain}.search_`,
              `${skillDomain}.getProperty_`,
              `${skillDomain}.performAction_`,
              `${skillDomain}.acceptAction`
          ),
      )
      .lambda();
  ```

#### Javascript

  For an example, see [Example skill](#example-skill).

  ```
  const CatalogExplorer = require('@alexa-skill-components/catalog-explorer').CatalogExplorer

  ...

  export const skillDomain = "skill.book.recommendation";

  exports.handler = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
          ...
          ...CatalogExplorer.createHandlers(
              `${skillDomain}.getPage`,
              `${skillDomain}.selectItemApi`,
              `${skillDomain}.search_`,
              `${skillDomain}.getProperty_`,
              `${skillDomain}.performAction_`,
              `${skillDomain}.acceptAction`
          ),
      .lambda();
  ```
  
### Step 9: Initialize CatalogReference

Make sure to initialize the CatalogReference before the component is invoked.
Refer to the [reference doc](./docs/REFERENCE.md) for initializing CatalogProvider while building Catalog Reference.

**TypeScript**

```
import { CatalogExplorer, FixedProvider} from
    '@alexa-skill-components/catalog-explorer';
const pageSize = 3; //represents the number of items to be displayed in the search result.
CatalogExplorer.buildCatalogReference(
    handlerInput,
    new FixedProvider(data), //implements CatalogProvider interface
    pageSize
)
```

**JavaScript**

```
import { CatalogExplorer,
    FixedProvider} = require('@alexa-skill-components/catalog-explorer')

const pageSize = 3; //represents the number of items to be displayed in the search result.
CatalogExplorer.buildCatalogReference(
    handlerInput,
    new FixedProvider(data), //implements CatalogProvider interface
    pageSize
)
```

### Step 10: Compile and deploy

Build your skill as you normally would. The component's dialog samples and API handlers, which were integrated into the skill, are built along with your skill's own custom dialog samples and handlers. Note that an Alexa Conversations skill deployment can take 20-40 minutes to complete.

**Note:** Make sure the ask-cli-x and @alexa/acdl packages are up to date.

```
askx compile && askx deploy
```

### Step 11: Test

To use the CLI to test your component, enter the following command. Alternatively, use the Alexa Skills Kit Developer Console (click the **Test** tab) to simulate your skill's behavior.

```
askx dialog -s <YOUR_SKILL_ID> -l en-US -g development
```

### Step 12: Iterate
After testing the default behavior of the component, see the [Reference](./docs/REFERENCE.md) document for available customization to suit your needs.
For details, see the [Example Skills](#example-skill).

Deploy any changes, compile your code, and then deploy again.

```
askx compile && askx deploy
```

## Example skill

For an example skill, see [BookRecommendation](./examples/BookRecommendation).

## Known issues

The Catalog Explorer component has certain limitations.
* No nore than 3 unique search events can be defined in the skill.
* No nore than 10 action events can be performed on a selected catalog item.
* No nore than 10 properties can be followed up.
* The actions defined for getting properties must be named in a specific way namely - getProperty_{propertyName} - eg. getProperty_title, getProperty_genre etc.    
* The actions defined for performing action after an item selection must be named in a specific way namely - performAction_{actionName} - eg. performAction_Purchase, performAction_SendToPhone etc.
* The actions defined for various search events must be named in a specific way namely - search_{eventType} eg. - search_new, search_refine.
* The component behaviour could be affected if `CatalogExplorer.useSession` flag is set to false, due to issues with passing data in API arguments between turns.

## Feedback

Amazon welcomes your feedback. Connect with us on [Github](https://github.com/alexa/skill-components#support).

## License

Copyright 2022 Amazon.com, Inc., or its affiliates. All rights reserved. You may not use this file except in compliance with the terms and conditions set forth in the accompanying [LICENSE](https://github.com/alexa/skill-components/blob/main/LICENSE) file. THESE MATERIALS ARE PROVIDED ON AN "AS IS" BASIS. AMAZON SPECIFICALLY DISCLAIMS, WITH RESPECT TO THESE MATERIALS, ALL WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
