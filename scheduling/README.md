<p align="center">
    <h1 align="center">Scheduling Skill Component</h1>
</p>
Alexa Skill Components are ready-to-use assets you can configure to suit your needs. Components are NPM packages built with Alexa Conversations (AC) and the Alexa Conversations Description Language (ACDL). For details, see [Use Alexa Skill Components](https://developer.amazon.com/en-US/docs/alexa/conversations/acdl-use-skill-components.html)

The Scheduling component lets your Alexa skill users make a new booking or reservation, see a list of existing reservations, modify a reservation, or cancel a reservation. To use Alexa Skill Components, [sign up for the developer preview](https://build.amazonalexadev.com/2022-Skill-Components-Interest.html). We actively update these components and continuously update them based on your feedback. To get the latest version, check back here often.

**Note:** Alexa Skill Components are provided as a pre-production alpha release in developer preview, with limited support. Our goal is to solicit feedback on our approach and design as we work toward general availability. While we make every effort to minimize issues with this pre-production alpha release, we can't promise backward compatibility or a rapid turn-around on bug fixes.

## Table Of contents

* [Introduction](#introduction)
  * [When to use this component](#when-to-use-this-component)
  * [Example Interaction](#example-interaction)
* [Get Started](#get-started)
* [Example skill](#example-skill)
* [Reference](#reference)
* [Recipes](#recipes)
* [Known issues](#known-issues)
* [Feedback](#feedback)
* [License](#license)

## Introduction

Alexa Skill Components are designed to be consistent with user experience best practices. This reduces your development time and improves the experience when a user makes, views, modifies, or cancels a booking or reservation for a restaurant table, movie ticket, or flight, for example.

### When to use this component

The Scheduling component is useful for apps in which users make, view, modify, or cancel reservations. Use the pre-built interaction patterns within the Scheduling component to build and customize such interactions.

### Example interaction

The following example skill interactions shows the different paths a component user might follow. These scenarios are taken taken from the [TableReservation example skill](./examples/TableRservation).

**Make a reservation or booking**

```text
User  > Book a table for me.
Alexa > Which restaurant do you have in mind?

User  > Fork and Fame.
Alexa > Sure, what date do you want to reserve?

Alexa > How many people?
User > Just two.

User  > 28th of April.
Alexa > What time?

User  > 10 PM.
Alexa > Great! You want to book a table for two at Fork and Fame on April 28th at 10 PM. Is that right?

User  > Yes.
Alexa > The booking was successful! You've booked a table for two at Fork and Fame on April 28th at 10 PM.
```

**View bookings**

```text
User  > Alexa, show me my exisitng reservations.
Alexa > You've booked Umami Junction on 2023-04-10, The Spice Grotto on 2023-04-20, and Fork and Fame on 2023-04-28.

User  > Next
Alexa > You've booked The Crispy Cauldron on 2023-04-29 and The Hungry Pachyderm on 2023-05-08.

User  > Fork and Fame
Alexa > Fork and Fame is booked for 22:00 on 2023-04-28?
Alexa > Yes, you've booked a table for two at Fork and Fame on 2023-04-28 at 10 PM.
```

#### Modify a booking

```text
User  > Alexa, show me my exisitng reservations.
Alexa > You've booked Fork and Fame for 2023-04-28, The Spice Grotto for 2023-04-20, and Umami Junction for 2023-04-10.

User  > Fork and Fame.
Alexa > Fork and Fame is booked for 22:00 on 2024-04-28.

User  > I want to change the time to 8:00 PM.
Alexa > Your booking at Fork and Fame was successfully modified to 2024-04-28 at 10:00 PM.
```

#### Cancel a booking

```text
User  > Show me my existing reservations.
Alexa > You've booked Fork and Fame for 2023-04-28, The Spice Grotto for 2023-04-20, and Umami Junction for 2023-04-10.

User  > Fork and Fame.
Alexa > Fork and Fame is booked for 22:00 on 2024-04-28

User  > Cancel it.
Alexa > Your booking at Fork and Fame was canceled.
```

## Get started

* [Step 1: Learn about Alexa Skill Components](#step-1-learn-about-alexa-skill-components)
* [Step 2: Install the Scheduling component](#step-2-install-the-scheduling-component)
* [Step 3: Call the reusable dialogs](#step-3-call-the-reusable-dialogs)
* [Step 4: Configure the interaction model](#step-4-configure-interaction-model)
* [Step 5: Set up API handlers](#step-5-set-up-api-handlers)
* [Step 6: Initialize scheduling](#step-6-initialize-scheduling)
* [Step 7: Compile and deploy](#step-7-compile-and-deploy)
* [Step 8: Test](#step-8-test)
* [Step 9: Iterate](#step-9-iterate)

### Step 1: Learn about Alexa Skill Components

Read the [Skill Components Getting Started Guide](https://github.com/alexa/skill-components#getting-started). If you're unfamiliar with skill development, the following example skills are a good place to start:

* [Hello World skill](https://developer.amazon.com/en-US/docs/alexa/custom-skills/tutorial-use-the-developer-console-to-build-your-first-alexa-skill.html)
* [Flight Search skill](https://developer.amazon.com/en-US/docs/alexa/workshops/acdl-flightsearch-tutorial/get-started/index.html)

### Step 2: Install the Scheduling component

The next step is to install the Scheduling Skill Component in your skill. If a `package.json` file doesn't already exist in the skill's root directory, create one with the following command.

```js
npm init
```

Install the Scheduling component from either the public release or a local build of the component.

#### Public release

In your skill's root directory, use `npm` to install the public release.

```js
npm install --save @alexa-skill-components/scheduling
npm install
```

Then install the component as a dependency in your API code (lambda).

```js
npm install --save @alexa-skill-components/scheduling
npm install
```

#### Local build

In a separate directory from your skill, build the Scheduling component from source code.

```js
git clone git@github.com:alexa/skill-components.git
cd skill-components
cd scheduling
npm run clean-build
```

Then, in your skill's root directory, use `npm` to install the local build.

```js
npm install --save "<path>/skill-components/scheduling"
npm install
```

Also install the component as a dependency in your API code (lambda):

```js
npm install --save "<path>/skill-components/scheduling"
npm install
```

### Step 3: Call the reusable dialogs

Import and call the ACDL reusable dialogs provided by this component from your skill's own custom sample dialogs.

#### 1. Import reusable dialogs and types

Import the component's reusable dialogs and types into your skill's ACDL.

```js
namespace skill.table_booking

import com.amazon.alexa.skill.components.scheduling.*
import com.amazon.alexa.skill.components.scheduling.types.*
```

#### 2. Create custom types

Create a custom type search for scheduling information that contain all the properties required to make a booking.

```js
type SchedulingInfo {
    optional Restaurants restaurantName
    optional DATE date
    optional TIME time
}
```

Create custom types for the booking item. For an example, see the [TableReservation sample skill](./examples/TableReservation).

```js
type BookingItem{
    String restaurantName
    String date
    String time
}
```

### 3. Create events, actions, and dialogs

Create events, actions, and dialogs for the following components.

There are two available ACDL reusable dialogs for Schedule: `Schedule` and `ScheduleWithSlotElicitation`

#### Schedule

If the skill developer already has the scheduling info or an existing mechanism in place to retrieve the scheduling info (from another component, for example), they can use this dialog.

`Schedule` ACDL reusable dialog requires the following:

**Action**

Create the `action` called for scheduling.

```js
action SchedulingResult bookTableAction(Restaurants restaurantName, DATE date, TIME time)
```

**Adaptor dialog**

Create a dialog to be passed in to the scheduling component that calls the scheduling `action` .

```js
dialog SchedulingResult bookTableActionAdaptor(SchedulingInfo schedulingInfo){
    sample{
        bookTicketAction(schedulingInfo.restaurantName, schedulingInfo.date, schedulingInfo.time)
    }
}
```

**Build the ScheduleConfig**

To call the `buildScheduleConfig` ACDL reusable dialog and build the `ScheduleConfig` configuration object, pass in the `action`, dialogs, and responses.

```js
schedulingConfig = buildSchedulingConfig<SchedulingInfo>(
            schedulingInfo = schedulingInfo,
            scheduleApiRef = bookTableAction,
            scheduleApiAdaptor = bookTableActionAdaptor,
            schedulingResultResponse = defSchResp
        )
```

**Call the Schedule reusable dialog**

To call the `Schedule` reusable dialog, pass in the previously built `ScheduleConfig`.

```js
result = Schedule<SchedulingInfo>(schedulingConfig)
```

#### ScheduleWithSlotElicitation

This dialog checks and confirms the scheduling info (like date, time, restaurant name) and then proceeds with the scheduling. It requires some additional configuration.

The `action`, the adaptor dialog, and the `schedulingResultResponse` are common for both `Schedule` and `ScheduleWithSlotElicitation` reusable dialogs.

`ScheduleWithSlotElicitation` ACDL reusable dialog, however, requires the following as well:

**Event**

Add examples of typical utterances that contain the slot types for each combination of scheduling info.

```js
scheduleEvent = utterances<SchedulingInfo>([
    "Reserve a table for me",
    "Book a table at {restaurantName} for {date} at {time}",
    "Book a table",
    "Please book a table for me",
    "Book a table at {restaurantName}",
    "I want to have a reservation at {restaurantName}",
    "I want to book a table for {date}"
])
```

**Ensure dialog adaptor**

Create a dialog that calls the `ensure` action on the scheduling action arguments, and provide the request prompts for each argument.

```js
dialog ensureDialog(){
    sample{
        ensure(
        RequestArguments {arguments = [bookTableAction.arguments.restaurantName], response = defRes},
        RequestArguments {arguments = [bookTableAction.arguments.date], response = defDate},
        RequestArguments {arguments = [bookTableAction.arguments.time], response = defTime}
        )
    }
}
```

**Payload adaptor**

Create a dialog that receives the scheduling info, unrolls it, and returns it again.

```js
dialog Thing payloadAdaptor(
    SchedulingInfo schedulingInfo
){
    sample{
        sc = SchedulingInfo{
            restaurantName = schedulingInfo.restaurantName,
            date = schedulingInfo.date,
            time = schedulingInfo.time
        }
        //return
        sc
    }
}
```

**Build the ScheduleWithSlotElicitationConfig**
To call the `buildScheduleWithSlotElicitationConfig` ACDL reusable dialog and build the `ScheduleWithSlotElicitationConfig` configuration object, pass in the `action`, dialogs, and responses.

```js
schedulingConfig = buildScheduleWithSlotElicitationConfig<SchedulingInfo>(
            scheduleEvent = scheduleEvent,
            scheduleApiRef = bookTabletAction,
            scheduleApiAdaptor = bookTabletActionAdaptor,
            ScheduleConfirmationResponse = defConf,
            ensureDialog = ensureDialog,
            PayloadAdaptor = payloadAdaptor,
            schedulingResultResponse = defSchResp
        )
```

**Call the ScheduleWithSlotElicitation reusable dialog**

To call the `ScheduleWithSlotElicitation` reusable dialog, pass in the previously built `ScheduleConfig`. This generates dialog flows to check and confirm the scheduling information.

```js
result = ScheduleWithSlotElicitation<SchedulingInfo>(schedulingConfig)
```

#### Show bookings

This uses the existing [List Navigation skill component](https://github.com/alexa/skill-components/tree/main/list-navigation). To use it, import list navigation reusable dialogs and types into your skill's ACDL.

```js
namespace skill.table_booking

import com.amazon.alexa.skill.components.list_navigation.*
import com.amazon.alexa.skill.components.list_navigation.types.*
```

**Actions**

For the Scheduling component to function properly, you must define the following actions in your skill's ACDL (because of ACDL limitations). You can name the actions whatever you like, but the types and argument names must be consistent. For details, reference the item types you defined in the preceding step.

```js
action Page<BookingItem> getBookingsApi(
    ListReference listRef,
    Optional<String> pageToken)

action BookingItem selectBookingApi(
    ListReference listRef,
    Page<BookingItem> page,
    NUMBER index)
```

To enable item selection by name during pagination, you must define a type for possible item names. You must use this type in an event and `action` as well, or you can use an exisiting type. As shown in the following code example, the interaction model includes a pre-defined `Restaurants` type.

```js
// interaction model
"types": [
    {
        "name": "Restaurants",
        "values": [
            {
                "name": { "value": "Fork and Fame" }
            },
            ...
        ]
    }
]
```

```js
// your skill's ACDL
import slotTypes.Restaurants

selectBookingByTitleEvent = utterances<ItemNameSlotWrapper<Restaurants>>(
    defaultSelectItemByNameUtterances)

action NUMBER indexOfBookingByNameApi(
    ListReference listRef, 
    Page<BookingItem> page, 
    Restaurants name)
```

**Build the ShowBookingConfig**

To call the `buildShowBookingConfig` ACDL reusable dialog and build the `ShowBookingConfig` configuration object, pass in the `action`, dialogs, and responses.

```js
showBookingConfig = buildShowBookingConfig<BookingItem, Restaurants>(
            getPageApi = getBookingsApi,
            selectItemApi = selectBookingApi,
            selectItemByNameEvent = selectBookingByTitleEvent,
            indexOfItemByNameApi = indexOfBookingByNameApi
        )
```

**Call the showBookings reusable dialog**

To call the `showBookingsDialog` reusable dialog, pass in the previously built `ShowBookingConfig`.

```js
booking = showBookings<BookingItem, Restaurants>(showBookingConfig)
```

The details (type `BookingItem`) returned by the dialog call can be passed to another API call, or they can be used in another dialog (`Modify` or `Cancel`, for instance) or in a response.

#### Modify

Modify is an ACDL reusable dialog that can be plugged in anywhere, as long as it gets the details (type `BookingItem`) of the booking to be modified.

**Event**

Create a set of utterances users can say to modify a booking, and consider the parameters that can be modified.

```js
defaultModifyUtterances = utterances<SchedulingInfo>(
    [
      "I want to change my time to {time}",
      "I want to change my date to {date}",
      "I want to change my change my date to {date} and time to {time}"
    ]
  )
```

**Action**

Create the `action` called when a `modify` utterance is detected.

```js
action SchedulingResult modifyAction(String restaurantName, optional DATE date, optional TIME time)
```

When you define the `action`, consider which parameter to use to identify the booking that's to be modified (primary key). For instance, in the previously defined `action`, `restaurantName` is used to identify the booking. Therefore it cannot be modified and is obtained from the scheduling info of the selected booking. Date and time, however, can be modified, so they're so they're `optinal`.

**Dialog**

Create dialog to be passed in for different variations of each `modify` event. Be sure to cover all the variations that occur in the utterance set.

```js
dialog SchedulingResult modifyActionResult(
    BookingItem prevBookingInfo,
    SchedulingInfo newInfo
){  
    sample{
        modifyAction(restaurantName = prevBookingInfo.restaurantName, date = newInfo.date, time = newInfo.time)
    }
    sample{
        modifyAction(restaurantName = prevBookingInfo.restaurantName, date = newInfo.date)
    }
    sample{
        modifyAction(restaurantName = prevBookingInfo.restaurantName, time = newInfo.time)
    }
}
```

As mentioned above, `restaurantName` is obtained from the details of the booking that's to be modified.

**Build the ModifyBookingConfig**

To call the `buildModifyBookingConfig` ACDL reusable dialog and build the `ModifyBookingConfig` configuration object, pass in the `action`, dialogs, and responses.

```js
modifyConfig = buildModifyBookingConfig<SchedulingInfo, BookingItem>(
            modifyEvent = defaultModifyUtterances,
            prevBookingInfo = booking,
            modifyApiRef = modifyAction,
            modifyApiAdaptor = modifyActionResult,
            ModifyBookingResponse = defModifyResp
        )
```

**Call the modifyBooking reusable dialog**

To call the ```modifyBookingDialog``` reusable dialog, pass in the previously built ```ModifyBookingConfig```.

```js
result = modifyBooking<SchedulingInfo, BookingItem>(modifyConfig)
```

#### Cancel

Similar to `Modify`, Cancel is an ACDL reusable dialog that can be plugged in anywhere, as long as it gets the booking details (type `BookingItem`) of the booking to be canceled.

**Event**

Create a set of utterances users might try in order to cancel a booking. A set of default utterances is provided for you.

```js
defaultCancelUtterances = utterances<Nothing>(
    [
      "cancel it",
      "cancel this booking",
      "I want to cancel this booking",
      "cancel this one"
    ]
  )
```

**Action**

Create the `action` called when an cancel utterance is detected.

```js
action SchedulingResult cancelAction(String restaurantName)
```

While defining the `action`, consider which parameter to use to identify the booking to be canceled (primary key). For instance, in the `action` defined above, we use `restaurantName` to identify the booking to be canceled.

**Adaptor dialog**

Create a dialog that takes the details (type `BookingItem`) of the booking to be canceled as an argument, and then calls the `action`.

```js
dialog SchedulingResult cancelAdaptor(
    BookingItem prevInfo
){
    sample{
        cancelAction(prevInfo.restaurantName)
    }
}
```

As mentioned above, `restaurantName` is obtained from the details of the booking that is to be canceled.

**Build the CancelBookingConfig**

To call the `buildCancelBookingConfig` ACDL reusable dialog and build the `CancelBookingConfig` configuration object, pass in the `action`, dialogs, and responses.

```js
cancelConfig = buildCancelBookingConfig<BookingItem>(
            prevBookingInfo = booking,
            cancelApiRef = cancelAction,
            cancelApiAdaptor = cancelAdaptor,
            CancelBookingResponse = defCancelResp
        )
```

**Call the cancelBooking reusable dialog**

To call the ```cancelBookingDialog``` reusable dialog, pass in the previously built ```CancelBookingConfig```.

```js
result = cancelBooking<SchedulingInfo, BookingItem>(modifyConfig)
```

### Step 4: Configure interaction model

Add all the possible slots types and slot values for the scheduling info in the skill interaction model.

```js
{
    "interactionModel": {
      "languageModel": {
        ...
        "types": [
                {
                    "values": [
                    {
                        "name": {
                            "value": "Fork and Fame"
                        }
                    },
                    {
                        "name": {
                            "value": "Umami Junction"
                        }
                    },
                    {
                        "name": {
                            "value": "The Crispy Cauldron"
                        }
                    },
                    {
                        "name": {
                            "value": "The Hungry Pachyderm"
                        }
                    },
                    {
                        "name": {
                            "value": "The Spice Grotto"
                        }
                    }
                    ],
                    "name": "Restaurants"
              }
            ]
        }
    }
}
```

### Step 5: Set up API handlers

Import and register the request handlers provided by the component into the skill's API code (where it can live along with the skill's other request handlers).

#### TypeScript

```js
  import { SchedulingComponent } from 
      '@alexa-skill-components/scheduling';

  ...

  export const skillDomain = "examples.table_booking";

  export const handler = SkillBuilders.custom()
      .addRequestHandlers(
          ...
          ...SchedulingComponent.createHandlers(
            `${skillDomain}.bookTableAction`,
            `${skillDomain}.getBookingsApi`,
            `${skillDomain}.selectBookingApi`,
            `${skillDomain}.indexOfBookingByNameApi`,
            `${skillDomain}.modifyAction`,
            `${skillDomain}.cancelAction`
        ),
      )
      .lambda();
```

#### Javascript

  For an example, see [Example skill](#example-skill).

```js
  const CatalogExplorer = require('@alexa-skill-components/scheduling')

  ...

  export const skillDomain = "examples.table_booking";

  exports.handler = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
          ...
          ...SchedulingComponent.createHandlers(
            `${skillDomain}.bookTicketAction`,
            `${skillDomain}.getBookingsApi`,
            `${skillDomain}.selectBookingApi`,
            `${skillDomain}.indexOfBookingByNameApi`,
            `${skillDomain}.modifyAction`,
            `${skillDomain}.cancelAction`
        ),
      .lambda();
```
  
### Step 6: Initialize scheduling

Make sure to initialize the `buildSchedulingReference` before the component is invoked. Refer to the [reference doc](./docs/REFERENCE.md) for information about how to initialize `SchedulingProvider` in `buildSchedulingReference`.

**TypeScript**

```js
import { SchedulingComponent, DefaultSchedulingProvider} from
    '@alexa-skill-components/scheduling';
    
const pageSize = 3; //represents the number of items to be displayed in each Show Bookings page

SchedulingComponent.buildSchedulingReference(
                handlerInput,
                new CustomProvider("us-east-1", "restaurantBookings"),
                pageSize
            )
```

**JavaScript**

```js
import { SchedulingComponent,
    DefaultSchedulingProvider} = require('@alexa-skill-components/schedulingr')

const pageSize = 3; //represents the number of items to be displayed each show bookings page

SchedulingComponent.buildSchedulingReference(
                handlerInput,
                new CustomProvider("us-east-1", "restaurantBookings"),
                pageSize
            )
```

### Step 7: Compile and deploy

Build your skill as you normally would. The component's dialog samples and API handlers, which were integrated into the skill, are built along with your skill's own custom dialog samples and handlers. Note that an Alexa Conversations skill deployment can take 20-40 minutes to complete.

**Note:** Make sure the ask-cli-x and @alexa/acdl packages are up to date.

```js
askx compile && askx deploy
```

### Step 8: Test

To use the CLI to test your component, enter the following command. Alternatively, use the Alexa Skills Kit Developer Console (click the **Test** tab) to simulate your skill's behavior.

```js
askx dialog -s <YOUR_SKILL_ID> -l en-US -g development
```

### Step 9: Iterate

After you test the default behavior of the component, see the [Reference](./docs/REFERENCE.md) document for available customization to suit your needs. For details, see the [Example skill](#example-skill).

Deploy any changes, compile your code, and then deploy again.

```js
askx compile && askx deploy
```

## Reference

Details on all dialogs and API handlers can be found in the [Reference doc](./docs/REFERENCE.md)

## Recipes

* [Create a custom Scheduling provider](./docs/RECIPES.md#create-a-custom-scheduling-provider)
* [Create a custom ListProvider to use with the component](./docs/RECIPES.md#create-a-custom-scheduling-provider)

## Example skill

For an example skill, see [TableReservation](./examples/TableReservation).

## Known issues

The Scheduling component has certain limitations.

* Because of data passed in API arguments between turns, the component behavior could be affected if the `SchedulingComponent.useSession` flag is set to `false`.

## Feedback

Amazon welcomes your feedback. For details, see the Alexa repository on [Github](https://github.com/alexa/skill-components#support).

## License

Copyright 2022 Amazon.com, Inc., or its affiliates. All rights reserved. You may not use this file except in compliance with the terms and conditions set forth in the accompanying [LICENSE](https://github.com/alexa/skill-components/blob/main/LICENSE) file. THESE MATERIALS ARE PROVIDED ON AN "AS IS" BASIS. AMAZON SPECIFICALLY DISCLAIMS, WITH RESPECT TO THESE MATERIALS, ALL WARRANTIES, EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
