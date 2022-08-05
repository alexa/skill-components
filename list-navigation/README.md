<p align="center">
  <img src="https://m.media-amazon.com/images/G/01/ask/SkillComponents/skillcomp_listnav._CB1198675309_.png">
  <br/>
  <h1 align="center">List Navigation Skill Component</h1>
</p>

Enable users of your skill to easily navigate through a list of items you provide.

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
* [Example skills](#example-skills)
* [Customer Experience Design Guidelines](#customer-experience-design-guidelines)
* [Known issues](#known-issues)

## Introduction
Alexa Skill Components encapsulate best customer experience (CX) design practices to reduce your development time. Learn more about Skill Components in the [Skill Components Getting Started guide](../README.md#getting-started).

Be it a list of to-do tasks, birthdays, items from a shopping catalog or menu, the List Navigation Skill Component helps you offer your customer a simple way to paginate through the list and make a selection.

### When should I use this component?
Are you building an app in which your customers will need to select from a list of options? Use the pre-built interaction patterns within the List Navigation Skill Component to build out and customize such interactions.  

### Example Interaction

This component allows a given list to be paginated (multiple items at once) through until a user selects a item. The following interaction sample is taken from the included [BooksNav example skill](./examples/BooksNav).

```
User  > What books do you have?
Alexa > How about The Shining by Stephen King, Dune by Frank Herbert, or Hyperion by Dan Simmons?
User  > show me more
Alexa > How about The Notebook by Nicholas Sparks, The Hobbit by JRR Tolkien, or A Game of Thrones by George R R Martin?
User  > the second one
Alexa > The Hobbit by JRR Tolkien is a fantasy novel, the summary is: a hobbit, a wizard, and some dwarves go on an adventure
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
npm install --save @alexa-skill-components/list-navigation
npm install
```

Also install the component as a dependency in your API code (lambda):
```
npm install --save @alexa-skill-components/list-navigation
npm install
```

**Local Build (not working due to CLI bug)**

In a seperate directory from your skill, build component from source:
```
git clone git@github.com:alexa/skill-components.git
cd skill-components
cd list-navigation
npm run clean-build
```

then, in your skill's root directory, use npm to install the local build:
```
npm install --save "<path>/skill-components/list-navigation"
npm install
```

Also install the component as a dependency in your API code (lambda):
```
npm install --save "<path>/skill-components/list-navigation"
npm install
```

### 3. Call reusable dialog

Import and call the [`navigateList`](./docs/REFERENCE.md#navigatelist) ACDL reusable dialog provided by this component from your skill's own custom sample dialogs; providing the configuration for your skill and a 
reference to the list you wish to allow user to navigate through.

**1. Import the component's reusable dialogs and types into you skill's ACDL**
```
namespace examples.books_nav

import com.amazon.alexa.skill.components.list_navigation.*
import com.amazon.alexa.skill.components.list_navigation.types.*
```

**2. Define a type for the items in your list**

Make sure the type has a "label" property (needed by default [`presentPageResponse`](./docs/REFERENCE.md#buildnavigationconfig)) and a "name" property (needed by defualt [`indexOfItemByNameApi`](./docs/REFERENCE.md#buildnavigationconfig)) alongside any other properties your items contain:

```
type BookItem {
    ...

    String label
    String name
}
```

**3. Define actions and events required to use list navigation component**

The following actions are currently required to be defined in your skill's ACDL (due to limitations in ACDL); the names of the actions may be whatever you would like, but the types and argument names must be as defined (referencing your item type defined in the prior step) for the component to function properly.
```
action Page<BookItem> getBooksPageApi(
    ListReference listRef, 
    Optional<String> pageToken)
action BookItem selectBookApi(
    ListReference listRef, 
    Page<BookItem> page,
    NUMBER index)
```

To enable selecting a item by name during pagination, a catalog type for possible item names must be defined and used in a event and action as well.
```
// interaction model
"types": [
    {
        "name": "TITLE",
        "values": [
            {
                "name": { "value": "The Shining" }
            },
            ...
        ]
    }
]
```
```
// your skill's ACDL
import slotTypes.TITLE

selectBookByTitleEvent = utterances<ItemNameSlotWrapper<TITLE>>(
    defaultSelectItemByNameUtterances)
action NUMBER indexOfBookByNameApi(
    ListReference listRef, 
    Page<BookItem> page, 
    TITLE name)
```

**4. Define a action to return a list reference**

You must have a action defined which will provide a reference to the list you would like to allow the user to navigate through:
```
action ListReference getBooks()
```
This action can have whatever name and arguments are desired.

**5. Build configuration object**

Call the [`buildNavigationConfig`](./docs/REFERENCE.md#buildnavigationconfig) ACDL reusable dialog in your
skill's sample to build the configuration object needed for list navigation to function, passing in the actions 
and events defined in prior steps:

```
booksNavigationConfig = buildNavigationConfig<BookItem, TITLE>(
    getPageApi = getBooksPageApi,
    selectItemApi = selectBookApi,
    selectItemByNameEvent = selectBookByTitleEvent,
    indexOfItemByNameApi = indexOfBookByNameApi,
)
```

**6. Call reusable dialog**

In one of your skill's samples, call the action your defined previously to get a reference to the list you wish to navigate and then call the [`navigateList`](./docs/REFERENCE.md#navigatelist) reusable dialog, passing in the previously built config and list reference, to generate dialog flows allowing the user to navigate through the list until a item is selected:

```
listRef = getBooks()

book = navigateList<BookItem, TITLE>(
    config = booksNavigationConfig,

    listRef = listRef
)
```

The book returned by the dialog call can be used to pass to another API call or used in a response (which can reference the [`selectItemApi`](./docs/REFERENCE.md#buildnavigationconfig) that was passed in when building 
the config object):
```
response(
    act = Notify { actionName = selectBookApi },
    response = presentItemPrompt,
    payload = BookItemPayload { book = book }
)
```

Combing everything together should result in a ACDL sample similar to [what is defined in the BooksNav example skill](./examples/BooksNav/skill-package/conversations/pagination.acdl).


### 4. Setup API Handlers

**1. Register API handlers**

Import and call the [`ListNav.createHandlers`](./docs/REFERENCE.md#class-listnav) function to construct all the request handlers required by the list navigation component into your skill's API code (where they will live alongside your skill's other request handlers). Make sure to pass in the fully qualified name of the actions you were required to define earlier.

**TypeScript**
```
import { ListNav } from '@alexa-skill-components/list-navigation';

...

export const handler = SkillBuilders.custom()
    .addRequestHandlers(
        ...
        
        ...ListNav.createHandlers(
            "examples.books_nav.getBooksPageApi",
            "examples.books_nav.selectBookApi",
            "examples.books_nav.indexOfBookByNameApi"
        )
    )
    .lambda();
```

**JavaScript**
```
const listNav = require('@alexa-skill-components/list-navigation')

...

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        ...
        
        ...listNav.ListNav.createHandlers(
            "examples.books_nav.getBooksPageApi",
            "examples.books_nav.selectBookApi",
            "examples.books_nav.indexOfBookByNameApi"
        )
    )
    .lambda();
```

**2. Setup List Provider**

In the handler for the action you defined to return a list reference, use the [`FixedListProvider`](./docs/REFERENCE.md#class-fixedlistprovider) class bundled with the component (or make your own implementing the [`ListProvider`](./docs/REFERENCE.md#interface-listprovider) interface) to generate the list reference that is passed into the component.

**Typescript**
```
import { Utils, ListNav, FixedListProvider } from '@alexa-skill-components/list-navigation';

...

BOOKS = [ /* fixed list of data */ ];
defaultPageSize = 3; // allowed sizes: 1-5

export class GetBooksHandler implements RequestHandler {
    canHandle(handlerInput : HandlerInput) : boolean {
        return Utils.isApiRequest(handlerInput, `examples.books_nav.getBooks`);
	}

    handle(handlerInput: HandlerInput) {
        const listRef = ListNav.buildListReference(
            handlerInput,
            new FixedListProvider(BOOKS),
            defaultPageSize
        );

        return handlerInput.responseBuilder
            .withApiResponse(listRef)
            .withShouldEndSession(false)
            .getResponse();
    }
}
```

**JavaScript**
```
const listNav = require('@alexa-skill-components/list-navigation')

...

BOOKS = [ /* fixed list of data */ ];
defaultPageSize = 3; // allowed sizes: 1-5

const GetBooksHandler = {
    canHandle(handlerInput) {
        return listNav.Utils.isApiRequest(handlerInput, "examples.books_nav.getBooks");
	},

    handle(handlerInput) {
        const listRef = listNav.ListNav.buildListReference(
            handlerInput,
            new listNav.FixedListProvider(BOOKS),
            defaultPageSize
        );

        return handlerInput.responseBuilder
            .withApiResponse(listRef)
            .withShouldEndSession(false)
            .getResponse();
    }
};
```

Refer to [BooksNav example skill](./examples/BooksNav/lambda/handlers/pagination/get-books.ts) for more details.

### 5. Compile and deploy the Skill

Build your skill as one would normally; the component's dialogs samples and API handlers (that were integrated into
the skill) will be built along-side your skill's own custom dialog samples and handlers.

```
askx compile && askx deploy
```

Note that a Alexa Conversations skill deployment can take 20-40 minutes to complete.

### 6. Test the Skill.
To do so via CLI, you can run the following:
```
askx dialog -s <YOUR_SKILL_ID> -l en-US -g development
```
Or you can use the Developer Console via the "Test" tab to simulate apart from your Alexa device.  

### 7. Iterate

After testing the default behavior of the component, look into the [reference doc](./docs/REFERENCE.md) to see possible customizations to suit your use case. 

Also look through the [Example Skills](#example-skills), and [CX Design Guidelines](#customer-experience-design-guidelines) for more information.

To deploy any changes, run compile and deploy again:
```
askx compile && askx deploy
```

## Reference

Details on all dialogs and API handlers can be found in the [Reference doc](./docs/REFERENCE.md)

## Example Skills

* [BooksNav](./examples/BooksNav)

## Customer Experience Design Guidelines

If customizing the default CX for this component, it's a good idea to follow some [design guidelines](./docs/CX_DESIGN_GUIDELINES.md).

## Known Issues

### Session doesn't end after navigation ends
The navigation dialog flows generated by a call to the [`navigateList`](./docs/REFERENCE.md#navigatelist) dialog always end in a call to the [`selectItemApi`](./docs/REFERENCE.md#buildnavigationconfig) provided in the config object; this API will always return `false` for the [`shouldEndSession`](https://developer.amazon.com/en-US/docs/alexa/custom-skills/manage-skill-session-and-session-attributes.html#session-lifecycle) flag as the component does not know whether a caller wants to end the session after navigation or not.

If you wish to end the session after navigation, then:

**1. define a custom `endSession` API in your skill**
```
namespace examples.books_nav

action endSession(BookItem book)
```

**2. Register the provided handler for the API**
```
import { EndSessionHandler } from '@alexa-skill-components/list-navigation';

...

export const handler = SkillBuilders.custom()
    .addRequestHandlers(
        ...

        new EndSessionHandler(`examples.books_nav.endSession`)
    )
    .lambda();
```

**3. Call `endSession` API after navigation**
```
book = navigateList<BookItem, TITLE>(
    config = booksNavigationConfig,

    listRef = listRef
)

endSession(book)

response(
    act = Notify { actionName = endSession },
    response = presentItemPrompt,
    payload = BookItemPayload { book = book }
)
```

Note that the final response has a `Notify` response act that now refers to the `endSession` API.

### Component can only be used for a single type of list
While the [`navigateList`](./docs/REFERENCE.md#navigatelist) dialog can be called multiple times across a single skill's various samples, all calls must use the same type parameters and config object; only possibly varying in the list reference that is passed into the dialog.

Failure to adhere to this limitation can lead to inaccuracies in the skill at run-time.
