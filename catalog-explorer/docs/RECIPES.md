# Catalog Explorer Recipes


## Creating a custom Catalog Provider

By default, The component uses a FixedProvider provider which is an implementation of [CatalogProvider interface](https://github.com/alexa/skill-components/blob/main/catalog-explorer/lambda/catalog-provider.ts#L54-L97). To customize this, simply define your own provider class implementing CatalogProvider with the functions as defined below in your lambda code.


```typescript
import {CatalogProvider, CatalogProviderRegistry} from "@alexa-skill-components/catalog-explorer";

export class CustomProvider<SearchCondtions, Item> implements CatalogProvider<SearchCondtions, Item> {
    //Given a name to the custom provider so as to register it in the provider registry.
    public static NAME = "customProvider"
    
    constructor() {
        //constructor implementation logic
    }
    
    performSearch(
        searchConditions: SearchConditions,
        pageSize: number
    ): RecommendationResult<SearchConditions, Item>{
        //custom logic for performSearch
    }

    getRecommendationsPage(
        searchConditions: SearchConditions, 
        pageSize: number,
        pageToken: PageToken | undefined,
        pagingDirection: PagingDirection
    ): RecommendationResult<SearchConditions, Item>{
        //custom logic for getRecommendationsPage
    }

    selectItem(
        currentPage: Page<Item>,
        index: number
    ): RecommendationResult<SearchConditions, Item>{
        //custom logic for selectItem  
    }

    getProperty(
        item: Item,
        propertyName: string
    ): PropertyResult{
        //custom logic for getProperty
    }

    performAction(
        item: Item, 
        actionName: string
    ): string{
        //custom logic for performAction
    }
    
    serialize(): any{
        //custom logic for serialize
    }
    
    getName(): string{
        return CustomProvider.NAME;
    }
}

CatalogProviderRegistry.register(CustomProvider.NAME, CustomProvider.deserialize)
```



## Creating a custom fixed list provider

The component has a FixedProvider provider which is an implementation of CatalogProvider interface. To customize the default implementation of FixedProvider, simply define your own provider class extending FixedProvider which enables to extend the functionalities such as providing hints on item selection and property follow-up or custom logic for performing actions.

The getName and deserialize functions have to be overridden by the skill developer in a similar fashion as below for the custom provider for correct working of the component.

For reference: [default FixedProvider](https://github.com/alexa/skill-components/blob/main/catalog-explorer/lambda/providers/fixed-provider.ts)

```typescript
import {FixedProvider, CatalogProviderRegistry, ProactiveOffer} from "@alexa-skill-components/catalog-explorer";

export class CustomProvider<SearchCondtions, Item> extends FixedProvider<SearchCondtions, Item> {
    //Given a name to the custom provider so as to register it in the provider registry.
    public static NAME = "customProvider"

    //Must override this function to implement custom functionlity
    getName(): string {
        return CustomProvider.NAME
    }

    //Must override this function to implement custom functionlity
    static deserialize(config: any): FixedProvider<any, any> {
        return new CustomProvider(config.list, config.seenList, config.prevPageLength);
    }
    
    performAction(item: Item, actionName: string): string {
        console.log("custom action performed: ", actionName);
        //To cast the Item type into any type to access the property
        const newItem = item as any;
        return `${newItem['title']}`
    }

    getOfferAfterSelectItem(item: Item): ProactiveOffer {
        return this.createProactiveHint(item, "");
    }

    getOfferAfterGetProperty(item: Item, propertyName: String): ProactiveOffer {
        return this.createProactiveHint(item, propertyName);
    }

    createProactiveHint(item: any, propertyName: String) {
        // for all even id items, hint to hear the item's summary; 
        // for all odd id items, hint to purchase the item;
        let hint = null;
        if (item.id % 2 == 0 && propertyName != "summary") {
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

CatalogProviderRegistry.register(CustomProvider.NAME, CustomProvider.deserialize)
```

## Creating a custom DDB list provider

The component has a DDBProvider provider which is an implementation of CatalogProvider interface. To customize the default implementation of DDBProvider, simply define your own provider class extending DDBProvider which enables to extend the functionalities such as providing hints on item selection and property follow-up or custom logic for performing actions.

The getName and deserialize functions have to be overridden by the skill developer in a similar fashion as below for the custom provider for correct working of the component.

For reference: [default DDBProvider](https://github.com/alexa/skill-components/blob/main/catalog-explorer/lambda/providers/ddb-provider.ts)

```typescript
import {DDBListProvider, CatalogProviderRegistry, ProactiveOffer} from "@alexa-skill-components/catalog-explorer";

export class CustomProviderDDB<SearchCondtions, Item> extends DDBListProvider<SearchCondtions, Item> {
    //Given a name to the custom provider so as to register it in the provider registry.
    public static NAME = "customProviderDDB"
    //Must override this function to implement custom functionlity
    getName(): string {
        return CustomProviderDDB.NAME
    }

    //Must override this function to implement custom functionlity
    static deserialize(config: any): DDBListProvider<any, any> {
        return new CustomProviderDDB(config.region, config.tableName,config.seenList,config.key,config.lek);
    }
    
    performAction(item: Item, actionName: string): string {
        console.log("custom action performed: ", actionName);
        //To cast the Item type into any type to access the property
        const newItem = item as any;
        return `${newItem['label']}`
    }


    getOfferAfterSelectItem(item: Item): ProactiveOffer {
        return this.createProactiveHint(item, "");
    }

    getOfferAfterGetProperty(item: Item, propertyName: String): ProactiveOffer {
        return this.createProactiveHint(item, propertyName);
    }

    createProactiveHint(skill: any, propertyName: String) {
        // for all even id books, hint to hear the book's summary; 
        // for all odd id books, hint to purchase the book;
        let hint = null;
        if (skill.id % 2 == 0 && propertyName != "summary") {
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

//Register the custom DDB provider
CatalogProviderRegistry.register(CustomProviderGames.NAME, CustomProviderGames.deserialize);
```


## Customizing Page Size

By default, the component uses page size as 3 for displaying the number of items in a single page of catalog items. To 
customize this, simply define your own page size and sent it in the [pageSize](https://github.com/alexa/skill-components/blob/main/catalog-explorer/docs/%20REFERENCE.md#methods) argument when calling the [`buildCatalogReference`](https://github.com/alexa/skill-components/blob/main/catalog-explorer/docs/%20REFERENCE.md#methods) function in your lambda code:

For reference: [default page size implementation](https://github.com/alexa/skill-components/blob/main/catalog-explorer/lambda/interface.ts#L60)

```typescript
import { CatalogExplorer, FixedProvider} from
    '@alexa-skill-components/catalog-explorer';
const pageSize = 4; //represents the number of items to be displayed in the search result.
CatalogExplorer.buildCatalogReference(
    handlerInput,
    new FixedProvider(data), //implements CatalogProvider interface
    pageSize
)
```
