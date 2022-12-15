# Catalog Explorer Reference

## ACDL Reusable Dialogs

### exploreCatalog

Reusable dialog that supports a user to explorer a catalog.

#### Type Parameters

* `Item`
    * The type of each item in the list
* `SearchConditions`
    * A type which has properties on the basis of which the user can perform search. 

#### Arguments

* `CatalogConfig<SearchConditions, Item> config` (required)
    * Configuration on which events/utterance sets and responses to use in the generated samples, see `buildCatalogConfig` dialog for how to build a config object
* `CatalogReference catalogRef` (optional)
    * Reference to list to allow user to search, navigate, etc. through it. 

#### Returns

`CatalogExplorationResult` which has `CatalogActionResult` which returns what action was performed and` Item` which returns what item was selected. 

### buildCatalogConfig

Used to build the configuration that can be passed into exploreCatalog; all config properties have defaults specified where possible, though APIs that utilize generic parameters must be specified by caller due to limitations in ACDL.

#### Type Parameters

* `Item`
    * The type of each item in the list
* `SearchConditions`
    * A type which has properties on the basis of which the user can perform search. 

#### Arguments

* `List<SearchPattern<SearchConditions, Item>> searchPatterns` (required)
    * List of all search patterns which are build using `buildSearchPattern` builder dialog. 
* `NavigationConfig<SearchConditions,Item> navConfig` (required)
    * NavigationConfig object which is build using `buildNavigationConfig` builder dialog. Consist of events, actions, responses for navigation
* `List<CatalogProperty<Item>> properties` (required)
    * List of all catalog properties which are build using `buildCatalogProperty` builder dialog 
* `List<CatalogAction<Item>> catalogActions `(required)
    * List of all catalog actions which are build using `buildCatalogAction` builder dialog. 
* `CatalogOffers<SearchConditions, Item> offers` (required)
    * CatalogOffers object which is build using `buildCatalogOffers` builder dialog. Consist of events, actions, responses for offers
* `Dialog2<PropertyConfig<SearchConditions, Item>, Optional<CatalogReference>, RecommendationResult<SearchConditions, Item> > allSearchPaths` (required)
    * constructed by the user in their skill. It should just call the allSearchPaths_{N}(PropertyConfig, CatalogReference) where N = no. of search events
    * Arguments:
        * `PropertyConfig config`:  config object which consists of list of search events, navConfig, list of catalog properties, list of catalog actions and offers object.
        * `CatalogReference catalogRef`:  Reference to the catalog of items
    * Returns: RecommendationResult which consists of recommended items after search. 
* `Dialog2<PropertyConfig<SearchConditions,Item>, Optional<CatalogReference>,RecommendationResult<SearchConditions, Item>> baseSearchPaths `(required)
    * constructed by the user in their skill. It should just call the baseSearchPaths_N(PropertyConfig, CatalogReference) where N= no. of search paths
    * Arguments:
        * `PropertyConfig config`:  config object which consists of list of search paths, navConfig, list of catalog properties, list of catalog actions and offers object.
        * `CatalogReference catalogRef`:  Reference to the catalog of items
    * Returns: RecommendationResult which consists of recommended items after search. 
* `Dialog3<PropertyConfig<SearchConditions, Item>, RecommendationResult<SearchConditions, Item>, Optional<CatalogReference>, RecommendationResult<SearchConditions, Item>> allFollowUpPaths`(required)
    * constructed by the user in their skill. It should just call the allFollowUpPaths_N(PropertyConfig, RecommendationResult, CatalogReference) where N= no. of follow-ups paths.
    * Arguments:
        * `PropertyConfig config`:  config object which consists of list of search paths, navConfig, list of catalog properties, list of catalog actions and offers object.
        * `RecommendationResult result`: The result of recommended items received as a result after navigation is passed into follow ups for further processing. 
        * `CatalogReference catalogRef`:  Reference to the catalog of items
    * Returns: RecommendationResult which consists of recommended items after search. 
* `Dialog3<PropertyConfig<SearchConditions, Item>, RecommendationResult<SearchConditions, Item>, Optional<CatalogReference>, RecommendationResult<SearchConditions, Item>> allCatalogActionPaths`(required)
    * constructed by the user in their skill. It should just call the allCatalogActionPaths_N(PropertyConfig, RecommendationResult, CatalogReference) where N= no. of actions.
    * Arguments:
        * `PropertyConfig config`:  config object which consists of list of search paths, navConfig, list of catalog properties, list of catalog actions and offers object.
        * `RecommendationResult result`: The result of recommended items received as a result after navigation is passed into follow ups for further processing. 
        * `CatalogReference catalogRef`:  Reference to the catalog of items
    * Returns: RecommendationResult which consists of recommended items after search. 

## Important API Classes and Types

### `class CatalogExplorer`

Main static interface to catalog explorer component on API side.

#### Properties

* `static useSession: boolean`
    * whether to rely on session (instead of API arguments) to pass data between turns (CatalogReference and page token).
    * Note: this can be used to work around issues with incorrect/unexpected data being passed into API calls between turns in some navigation interactions and use cases; will no longer be needed if data passing issues can be resolved.
    * Currently, defaults to `true`.

#### Methods

* `static buildCatalogReference`
    * build a catalog reference instance for a given catalog provider instance.
    * Arguments:
        * `handlerInput: HandlerInput`: HandlerInput instance for the current API request, needed to store state into current session.
        * `catalogProvider: CatalogProvider<any,any>`: CatalogProvider instance for the catalog to build a reference for.
        * `pageSize: number`: Number of items that should be in each page when navigating through catalog; defaults to 3.
    * Returns: constructed catalog reference instance
* `static createHandlers`
    * creates all Alexa RequestHandler instances that need to be registered in a skill's API endpoint for catalog explorer component to work correctly.
    * Arguments:
        * `getPageApiName: string`: fully qualified name (FQN, including namespace) of the getPageApi passed into buildNavigationConfig in ACDL
        * `selectItemApiName: string`: FQN of the selectItemApi passed into buildNavigationConfig in ACDL
        * `searchApiName: string`: FQN of the searchApi passed into buildNavigationConfig in ACDL
        * `getPropertyApiName: string`: FQN of the getPropertyApi passed into buildNavigationConfig in ACDL
        * `performActionApi: string`: FQN of the performActionApi passed into buildNavigationConfig in ACDL
        * `acceptOfferApiName: string`: FQN of the acceptOfferApi passed into buildNavigationConfig in ACDL
    * Returns: array of constructed handlers

### `interface CatalogProvider`

Interface every catalog provider must adhere to, contains methods used by catalog explorer handlers when exploring a catalog

#### Type parameters

* SearchConditions: type of search conditions object which will be used for searching in the catalog
* Item: type of each item in the catalog the provider handles

#### Methods

* `performSearch( searchConditions: SearchConditions, pageSize: number ): RecommendationResult<SearchConditions, Item>`
    * search for the given search conditions and get a page of items for the given page size.
* `getRecommendationsPage( searchConditions: SearchConditions,  pageSize: number, pageToken: PageToken | undefined, pagingDirection: PagingDirection ): RecommendationResult<SearchConditions, Item>`
    * get a page of items for the given search conditions, page token, page size and paging direction; an undefined page token is a request for the first page of items.
* `selectItem( currentPage: Page<Item>, index: number ): RecommendationResult<SearchConditions, Item>`
    * called to select item from the given current page of items through the given index.
* `getProperty( item: Item, propertyName: string): PropertyResult`
    * called to get the details for a given property name for the given item
* `performAction( item: Item,  actionName: string): string`
    * perform action on the selected item.
* `serialize(): any`
    * called to serialize any state needed by a catalog provider instance; this state will be passed into the catalog provider's deserializer on the next API call.
* `getName(): string`
    * unique name for a catalog provider type; used to find the deserilizer for a catalog provider in the CatalogProviderRegistry.

### `class FixedProvider`

Catalog provider for a fixed/static catalog of items; useful for testing, debugging, or real use cases utilising a fixed catalog; each page token is simply a reference to the index of the first item in the page being requested.

#### Methods

* `constructor`
    * Arguments:
        * `list: Item[]`: list to be provided
    * Note: The below constructor arguments are required to maintain the provider state between turns and are not needed to be provided by the user

        * `seenList: Item[]`: list of items which have been shown to the user in the current session
        * `prevPageLength: number`: number of items in the previously displayed page

#### Usage

The FixedProvider class can be extended by the skill developer to override the existing methods as per the requirements of the skill:
**The getName and deserialize functions have to be overridden by the skill developer in a similar fashion as below for the custom provider to perform as expected. The custom provider has to be registered in the CatalogProviderRegistry.**

```
import {FixedProvider, CatalogProviderRegistry, ProactiveOffer, RecommendationResult} from "@alexa-skill-components/catalog-explorer";

export class CustomProvider<SearchCondtions, Item> extends FixedProvider<SearchCondtions, Item> {
    public static NAME = "customProvider";
    
    performAction(item: Item, actionName: string): string {
        console.log("custom action performed: ", actionName);
        const newItem = item as any;
        return `${newItem['title']}`;
    }

    getName(): string {
        return CustomProvider.NAME;
    }

    static deserialize(config: any): FixedProvider<any, any> {
        return new CustomProvider(config.list, config.seenList, config.prevPageLength);
    }

    getOfferAfterSelectItem(item: Item): ProactiveOffer {
        return this.createProactiveHint(item, "");
    }

    getOfferAfterGetProperty(item: Item, propertyName: String): ProactiveOffer {
        return this.createProactiveHint(item, propertyName);
    }

    createProactiveHint(book: any, propertyName: String) {
        // for all even id books, hint to hear the book's summary; 
        // for all odd id books, hint to purchase the book;
        let hint = null;
        if (book.id % 2 == 0 && propertyName != "summary") {
            hint = {
                propertyName: "summary"
            };
        } else {
            hint = {
                actionName: "purchase"
            };
        }
        return hint;
    }
}

//Register the custom provider
CatalogProviderRegistry.register(CustomProvider.NAME, CustomProvider.deserialize)
```