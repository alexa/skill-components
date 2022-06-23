# Overview

# ACDL Reusable Dialogs

## navigateList
Reusable dialog that supports a user navigating through a list of items until they pick a item.

### Type Parameters
* `Item`
    * The type of each item in the list
* `ItemName`
   * A slot type containing the names that can be used to refer to a item during selection; needed to ensure item selection by name works properly

### Arguments
* `NavigationConfig<Item, ItemName> config` (required) 
    * Configuration on which events/utterance sets and responses to use in the generated samples, see [`buildNavigationConfig`](#buildNavigationConfig) dialog for how to build a config object
* `ListReference listRef` (required)
    * Reference to list to allow user to navigate through

### Returns
The item selected by the user

### Limitations
* A event or API call must proceed a call to this dialog
* A API call or response must follow a call to this dialog; responses can refer to the [`selectItemApi`](#buildNavigationConfig) specified in the configuration

## buildNavigationConfig
Used to build the configuration that can be passed into navigateList; all config properties have defaults specified where possible, though APIs that utilize generic parameters must be specified by caller due to limitations in ACDL.

### Type Parameters
* `Item`
    * The type of each item in the list
* `ItemName`
   * A slot type containing the names that can be used to refer to a item during selection; needed to ensure item selection by name works properly

### Arguments
* `Action2<ListReference, Optional<String>, Page<Item>> getPageApi` (required)
    * called to get a specific page from the list being navigated with; needs to be defined by caller, but implementation can utilize handler provided by list nav component
    * Arguments:
        * `ListReference listRef`: reference to list being navigated 
        * `Optional<String> pageToken`: indicates the page to retrieve
    * Returns: page of items requested
* `Action3<ListReference, Page<Item>, NUMBER, Item> selectItemApi` (required)
    * called to retrieve a specific item from a given page, needed to work around ACDL issues with indexing into a list and to ensure all navigation samples end in a single API to make follow-up responses possible; needs to be defined by caller, but implementation can utilize handler provided by list nav component
    * Arguments:
        * `ListReference listRef`: reference to list being navigated
        * `Page<Item> page`: the page to retrieve an item from
        * `NUMBER index`: the index of the item in the page to retrieve (starts at 1)
    * Returns: Item retrieved
* `Action3<ListReference, Page<Item>, ItemName, NUMBER> indexOfItemByNameApi` (required)
    * called when a user tries to select a item on the current page by name; needs to be defined by caller, but implementation can utilize handler provided by list nav component
    * Arguments:
        * `ListReference listRef`: list to select an item from
        * `Page<Item> page`: page to select an item from
        * `ItemName name`: name of the item to select
    * Returns: the selected item
* `Event<Nothing> nextPageEvent`
    * event to navigate to the next page
    * defaults to simple utterance set containing "next", "show me more", etc.
* `Event<Nothing> prevPageEvent`
    * event to navigate to the previous page
    * defaults to simply utterance set containing "previous", "go back", etc.
* `Response presentPageResponse`
    * response to present a page of items to the user; note that the default response requires each item in the list to have a "label" propety and only supports up to (and including) 5 items per page
    * defaults to a provided APLA document with text of "How about X, Y, or Z?"
    * Payload:
        * `List<Item> page.items`: the list of items for the current page
* `Event<OrdinalSlotWrapper> selectItemByOrdinalEvent = defaultSelectItemByOrdinalEvent`
    * event for selecting a item on the current page by ordinal (first, second, etc.)
    * defaults to simple utterance set containing "{ordinal}", "the {ordinal} one", etc.
* `Event<IndexSlotWrapper> selectItemByIndexEvent = defaultSelectItemByIndexEvent`
    * event for selecting a item on the current page by index (1, 2, 3, etc.)
    * defaults to simple utterance set containing "{index}", "number {index}", etc.
* `Event<ItemNameSlotWrapper<ItemName>> selectItemByNameEvent`
    * event for selecting a item on the current page by custom item name
    * defaults to simple utterance set containing "{name}", "{name} would be good", etc.
* `Event<Nothing> selectRandomItemEvent`
    * event for selecting a item on the current page at random
    * defaults to simple utterance set containing "random", "I don't care", etc.

### Returns
Constrcuted configuration object

### Limitations
* Must be called inside a sample, not at root/namespace level of a ACDL file due to limitations in ACDL

# API Handlers

## EndSessionHandler

Special util API just to indicate that the session should end (after the up-coming response)

Note: the current run-time behavior is to re-prompt on all responses where the prior API returns shouldEndSession=false (which the list-nav component does as it doesn't know whether a skill wishes to end a session or not), so the skill will need to  utilize a API (like this one) to end the session if desired

### Constructor Arguments

* `apiName : string` (required)
  * (Fully qualified) name of the ACDL action this handler is meant to handle requests for

# Important API Classes and Types

## `class ListNav`
Main static interface to list navigation component on API side

### Properties
* `static useSession: boolean`
    * whether to rely on session (instead of API arguments) to pass data between turns (ListReference and page token)
    * Note: this can be used to work around issues with incorrect/unexpected data being passed into API calls between turns in some navigation interactions and use cases; will no longer be needed if data passing issues can be resolved
    * Defaults to `true` currently

### Methods
* `static buildListReference`
    * build a list reference instance for a given list provider instance
    * Arguments:
        * `handlerInput: HandlerInput`: HandlerInput instance for the current API request, needed to store state into current session
        * `listProvider: ListProvider<any>`: ListProvider instance for the list to build a reference for
        * `pageSize: number`: Number of items that should be in each page when navigating through list; defaults to 3
    * Returns: constructed list reference instance
* `static createHandlers`
    * creates all Alexa RequestHandler instances that need to be registered in a skill's API endpoint for list navigation component to work correctly.
    * Arguments:
        * `getPageApiName: string`: fully qualified name (FQN, including namespace) of the getPageApi passed into buildNavigationConfig in ACDL
        * `selectItemApiName: string`: FQN of the selectItemApi passed into buildNavigationConfig in ACDL
        * `indexOfItemByNameApiName: string`: FQN of the indexOfItemByNameApi passed into buildNavigationConfig in ACDL
        * `itemNameMatcher: ItemNameMatcher`: Matcher callback method used to match a item name to a specific item in the page of items being presented to the user; defaults to a matcher that assumes each item has a "name" property to match against
    * Returns: array of constructed handlers

## `interface ListProvider`
interface every list provider must adhere to, contains methods used by list nav handlers when navigating through a list

### Type parameters
* T: type of each item in the list the provider handles

### Methods
* `getPage(pageToken: PageToken | undefined, pageSize: number) : Page<T>`
    * get a page of items for the given page token and page size; a undefined page token is a request for the first page of items
* `serialize(): any`
    * called to serialize any state needed by a list provider instance; this state will be passed into the list provider's deserializer on the next API call
* `getName(): string`
    * unique name for a list provider type; used to find the deserilizer for a list provider in the ListProviderRegistry

## `class FixedListProvider`
List provider for a fixed/static list of items; useful for testing, debugging, or real use cases utilizing a fixed list; each page token is simply a reference to the index of the first item in the page being requested.

### Methods
* `constructor`
    * Arguments:
        * `list: T[]`: list to be provided



