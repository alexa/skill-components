# Scheduling Component Reference

## ACDL Reusable Dialogs

### Schedule

Reusable dialog that enables a user to schedule a booking, given the `SchedulingInfo` is retrieved.

#### Type Parameters
* `SchedulingInfo`
    * A type which has all the properties required to make a booking. 

#### Arguments

* `ScheduleConfig<SchedulingInfo> config` (required)
    * Consists of schedulingInfo, action, adaptor dialog and a response, see `buildScheduleConfig` dialog for how to build a config object

#### Returns

`SchedulingResult` which has `schedulingSuccess` which indicates if the booking was successfull or not and `details` which returns the details of the booking.

### buildScheduleConfig

Used to build the configuration that can be passed into `Schedule`; all config properties have defaults specified where possible, though APIs that utilize generic parameters must be specified by caller due to limitations in ACDL.

#### Type Parameters

* `SchedulingInfo`
    * A type which has all the properties required to make a booking. 

#### Arguments

* `SchedulingInfo schedulingInfo` (required)
    * SchedulingInfo of the reservation to be made. 
* `Action scheduleApiRef` (required)
    * Defined by the skill developer in the skill, the action that gets triggered for scheduling.
* `Dialog1<SchedulingInfo, SchedulingResult> scheduleApiAdaptor` (required)
    * Created by the skill developer in the skill, dialog that calls the scheduling action.
* `Response schedulingResultResponse`(optional)
    * Response for the returned `SchedulingResult`, can be overridden by the skill developer. The component consists of a default response.

#### Returns

Constructed configuration object i.e. `ScheduleConfig`.

### ScheduleWithSlotElicitaion

Reusable dialog that enables a user to schedule a booking, also retrieves and confirms the `SchedulingInfo` of the booking to be made.

### Type Parameters

* `SchedulingInfo`
    * A type which has all the properties required to make a booking. 

### Arguments

* `ScheduleWithSlotElicitationConfig<SchedulingInfo> config` (required)
    * Consists of events, action, adaptor dialogs and a responses, see `buildScheduleWithSlotElicitationConfig` dialog for how to build a config object

#### Returns

`SchedulingResult` which has `schedulingSuccess` which indicates if the booking was successfull or not and `details` which returns the details of the booking.

### buildScheduleWithSlotElicitationConfig

Used to build the configuration that can be passed into `ScheduleWithSlotElicitation`; all config properties have defaults specified where possible, though APIs that utilize generic parameters must be specified by caller due to limitations in ACDL.

#### Type Parameters

* `SchedulingInfo`
    * A type which has all the properties required to make a booking. 

#### Arguments
* `Event<SchedulingInfo> scheduleEvent` (required)
    * Set of utterances which will be said by the user to schedule a booking.
* `Action scheduleApiRef` (required)
    * Defined by the skill developer in the skill, the action that gets triggered for scheduling.
* `Dialog1<SchedulingInfo, SchedulingResult> scheduleApiAdaptor` (required)
    * Created by the skill developer in the skill, dialog that calls the scheduling action.
* `Response ScheduleConfirmationResponse` (required)
    * Response to confirm the scheduling info before proceeding with the booking.
* `Dialog0<Nothing> ensureDialog`(required)
    * Created by the skill developer in the skill, dialog that ensures the scheduling info.
* `Dialog1<SchedulingInfo, Thing> PayloadAdaptor` (required)
    * Dialog created by the skill developer to unroll the scheduling info, due to limitations in ACDL.
* `Response schedulingResultResponse`(optional)
    * Response for the returned `SchedulingResult`, can be overridden by the skill developer. The component consists of a default response.
* `Event<Nothing> affirmUtterances = defaultAffirmUtterances`(optional)
    * Utterances affirming the scheduling info for the booking to be made, can be overriden by the skill developer. The component consists of default utterances.

#### Returns

Constructed configuration object i.e. `ScheduleWithSlotElicitationConfig`.

### showBookings

Reusable dialog that enables a user to see a list of the existing reservations and gives the user the ability to select a reservation from the displayed list and see it's details.

#### Type Parameters
* `BookingItem`
    * The type of each scheduled booking. 
* `BookingName`
    * A slot type containing the names that can be used to refer to a booking during selection; needed to ensure item selection by name works properly

#### Arguments

* `ShowBookingsConfig<BookingName, BookingName> config` (required)
    * Consists of actions, event and response, see `buildShowBookingsConfig` dialog for how to build a config object
#### Returns

`BookingItem`, the booking selected by the user.

### buildShowBookingsConfig

Used to build the configuration that can be passed into `showBookings`; all config properties have defaults specified where possible, though APIs that utilize generic parameters must be specified by caller due to limitations in ACDL.

### Type Parameters

* `BookingItem`
    * The type of each scheduled booking. 
* `BookingName`
    * A slot type containing the names that can be used to refer to a booking during selection; needed to ensure item selection by name works properly

### Arguments

* `Action2<ListReference, Optional<String>, Page<BookingItem>> getBookingsPageApi` (required)
    * called to get a specific page from the list of bookings being navigated; needs to be defined by caller, but implementation can utilize handler provided by the component
    * Arguments:
        * `ListReference listRef`: reference to list being navigated 
        * `Optional<String> pageToken`: indicates the page to retrieve
    * Returns: page of bookings requested
* `Action3<ListReference, Page<BookingItem>, NUMBER, BookingItem> selectBookingApi` (required)
    * called to retrieve a specific booking from a given page, needed to work around ACDL issues with indexing into a list and to ensure all navigation samples end in a single API to make follow-up responses possible; needs to be defined by caller, but implementation can utilize handler provided by the component
    * Arguments:
        * `ListReference listRef`: reference to list being navigated
        * `Page<BookingItem> page`: the page to retrieve a booking from
        * `NUMBER index`: the index of the booking in the page to retrieve (starts at 1)
    * Returns: BookingItem retrieved
* `Action3<ListReference, Page<BookingItem>, BookingName, NUMBER> indexOfBookingByNameApi` (required)
    * called when a user tries to select a booking on the current page by name; needs to be defined by caller, but implementation can utilize handler provided by the component
    * Arguments:
        * `ListReference listRef`: list to select a booking from
        * `Page<BookingItem> page`: the page to select a booking from
        * `BookingName name`: name of the booking to select
    * Returns: the selected booking
* `Event<ItemNameSlotWrapper<ItemName>> selectBookingByNameEvent` (required)
    * event for selecting a booking on the current page by custom booking name
    * defaults to simple utterance set containing "{name}", "{name} would be good", etc.
* `Response presentPageResponse` (optional)
    * response to present a page of bookings to the user; note that the default response requires each booking item in the list to have a "label" propety and only supports up to (and including) 5 booking items per page
    * defaults to a provided APLA document with text of "You have booked X, Y, Z?"
    * Payload:

        * `List<Item> page.items`: the list of items for the current page


Constructed configuration object i.e. `ShowBookingsConfig`.

#### Returns
### modifyBooking


#### Type Parameters
* `SchedulingInfo`
    * A type which has all the properties required to make a booking. 
* `BookingItem`
    * The type of each scheduled booking. 

#### Arguments

* `ModifyBookingConfig<SchedulingInfo, BookingItem> config` (required)
    * Consists of an event, BookingItem (of the booking to be modified), action, adaptor dialog and a response, see `buildModifyBookingConfig` dialog for how to build a config object

#### Returns

`SchedulingResult` which has `schedulingSuccess` which indicates if the booking was successfully modified or not and `details` which returns the details of the booking.

### buildModifyBookingConfig

Used to build the configuration that can be passed into `modifyBooking`; all config properties have defaults specified where possible, though APIs that utilize generic parameters must be specified by caller due to limitations in ACDL.

Reusable dialog that enables a user to modify a booking.
#### Type Parameters
* `SchedulingInfo`
    * A type which has all the properties required to make a booking. 
* `BookingItem`
    * The type of each scheduled booking. 

#### Arguments

* `Event<SchedulingInfo> modifyEvent` (required)
    * Set of utterances which will be said by the user to modify a booking. 
* `BookingItem prevBookingInfo` (required)
    * Booking details of the booking to be modified.
    * Consists of a parameter that can be used to uniquely identify the booking to be modified.
* `Action modifyApiRef` (required)
    * Defined by the skill developer in the skill, the action that gets triggered for modifying a booking.
* `Dialog2<BookingItem ,SchedulingInfo, SchedulingResult> modifyApiAdaptor` (required)
    * Created by the skill developer in the skill, dialog that calls the modify action.
    * Can have multiple samples to cover all the variations that occur in the utterance set.
* `Response ModifyBookingResponse`(optional)
    * Response for the returned `SchedulingResult`, can be overridden by the skill developer. The component consists of a default response.

#### Returns

Constructed configuration object i.e. `ModifyBookingConfig`.


### cancelBooking

Reusable dialog that enables a user to cancel a booking.

#### Type Parameters
* `BookingItem`
    * The type of each scheduled booking. 

#### Arguments

* `CancelBookingConfig<BookingItem> config` (required)
    * Consists of an event, BookingItem (of the booking to be cancelled), action, adaptor dialog and a response, see `buildCancelBookingConfig` dialog for how to build a config object

#### Returns

`SchedulingResult` which has `schedulingSuccess` which indicates if the booking was successfully cancelled or not and `details` which returns the details of the booking.

### buildCancelBookingConfig

Used to build the configuration that can be passed into `cancelBooking`; all config properties have defaults specified where possible, though APIs that utilize generic parameters must be specified by caller due to limitations in ACDL.

#### Type Parameters 
* `BookingItem`
    * The type of each scheduled booking. 

#### Arguments

* `Event<SchedulingInfo> cancelEvent` (optional)
    * Set of utterances which will be said by the user to cancel a booking, can be overridden by the skill developer. The component consists of default utterances.
* `BookingItem prevBookingInfo` (required)
    * Booking details of the booking to be cancelled.
    * Consists of a parameter that can be used to uniquely identify the booking to be cancelled.
* `Action cancelApiRef` (required)
    * Defined by the skill developer in the skill, the action that gets triggered for cancelling a booking.
* `Dialog2<BookingItem ,SchedulingInfo, SchedulingResult> cancelApiAdaptor` (required)
    * Created by the skill developer in the skill, dialog that calls the cancel action.
* `Response CancelBookingResponse`(optional)
    * Response for the returned `SchedulingResult`, can be overridden by the skill developer. The component consists of a default response.

#### Returns

Constructed configuration object i.e. `CancelBookingConfig`.

## Important API Classes and Types

### `class SchedulingComponent`

Main static interface to scheduling component on API side.

#### Properties

* `static useSessionArgs: boolean`
    * whether to rely on session arguments (instead of API arguments) to pass data between turns (scheduling info).
    * Note: this can be used to work around issues with incorrect/unexpected data being passed into API calls between turns in some interactions and use cases; will no longer be needed if data passing issues can be resolved.
    * Currently, defaults to `true`.

#### Methods

* `static buildSchedulingReference`
    * build a scheduling reference instance for a given scheduling provider instance.
    * Arguments:
        * `handlerInput: HandlerInput`: HandlerInput instance for the current API request, needed to store state into current session.
        * `schedulingProvider: SchedulingProvider<any>`: SchedulingProvider instance to build a reference for.
        * `pageSize: number`: Number of bookings that should be in each page when asked to show existing bookings; defaults to 3.
    * Returns: constructed scheduling reference instance

* `static createHandlers`
    * creates all Alexa RequestHandler instances that need to be registered in a skill's API endpoint for scheduling component to work correctly.
    * Arguments:
        * `scheduleApiName: string`: fully qualified name (FQN, including namespace) of the scheduleApi passed into the buildScheduleConfig dilaog or the buildScheduleWithSlotElicitationConfig dialog in ACDL
        * `getBookingsPageApiName: string`: FQN of the getBookingsPageApi passed into the buildShowBookingsConfig dialog in ACDL
        * `selectBookingApiName: string`: FQN of the selectBookingApi passed into the buildShowBookingsConfig dialog in ACDL
        * `indexOfBookingByNameApiName: string`: FQN of the indexOfBookingByNameApi passed into the buildShowBookingsConfig dialog in ACDL
        * `modifyBookingApiName: string`: FQN of the modifyBookingApi passed into the buildModifyBookingConfig dialog in ACDL
        * `cancelBookingApiName: string`: FQN of the cancelBookingApi passed into the buildModifyBookingConfig dialog in ACDL
    * Returns: array of constructed handlers

### `interface SchedulingProvider`

Interface every scheduling provider must adhere to, contains methods used by scheduling component handlers.

#### Type parameters

* SchedulingInfo: A type which has all the properties required to make a booking.

#### Methods

* `schedule(
        schedulingInfo: SchedulingInfo
    ): SchedulingResult | Promise<SchedulingResult>`
    * try to schedule a booking for the given scheduling information and return whether booking was successful or not, along with the details.
* `showBookingsListProvider(): ListProvider<any>`
    * return a ListProvider object to create a list reference from.
    * since the component uses the existing [ListNavigation component](https://github.com/alexa/skill-components/tree/main/list-navigation) internally to navigate through the list of existing reservations, a [`ListProvider`](https://github.com/alexa/skill-components/blob/main/list-navigation/docs/REFERENCE.md#interface-listprovider) object is required to create a ListReference.
    * skill developer can [create his own custom ListProvider](https://github.com/alexa/skill-components/blob/main/list-navigation/docs/RECIPES.md#creating-a-custom-list-provider) and return it, or use one from the [available providers](https://github.com/alexa/skill-components/blob/main/list-navigation/docs/REFERENCE.md#class-ddblistprovider) in the ListNavigation component
* `modify(
        newSchedulingInfo: SchedulingInfo,
        prevSchedulingInfo?: SchedulingInfo
    ): SchedulingResult | Promise<SchedulingResult>`
    * called to modify the details of an existing reservation, returns whether the booking was successfully modified or not, along with the details
* `cancel(
        schedulingInfo: SchedulingInfo
    ): SchedulingResult | Promise<SchedulingResult>`
    * called to cancel an existing reservation, returns whether the booking was successfully cancelled or not, along with the details
* `serialize(): any`
    * called to serialize any state needed by a scheduling provider instance; this state will be passed into the scheduling provider's deserializer on the next API call.
* `getName(): string`
    * unique name for a scheduling provider type; used to find the deserilizer for a scheduling provider in the ProviderRegistry.

### `class SampleSchedulingProvider`

A sample scheduling provider provided for reference, assuming that the existing reservations are stored in a DynamoDB table, useful for testing and debugging.

Note: Ensure that the lambda function has READ access to the DynamoDB table, to use this sample provider.

### Methods
* `constructor`
    * Arguments:
        * `region: string`: aws region where the DynamoDB table is hosted (ex. "us-east-1")
        * `tableName: string`: name of the DynamoDB table
