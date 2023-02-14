# Book Recommendation Example Skill

Catalog Explorer component has been used with the book recommendation skill to explore the the catalogs of books.

### Getting Started
To test and try out the example skill follow these steps - 
1. Run `npm run clean-build` from inside the example skill folder to install the dependencies and compile the skill.
2. Run `askx deploy` to deploy the compiled skill.

These commands can be referred in the scripts section of package.json file [here](https://github.com/alexa/skill-components/blob/main/catalog-explorer/examples/BookRecommendation/package.json#L7-L20)

### Creating a custom fixed list provider
The book recommendation skill uses a custom fixed list provider that overrrdies some functions of the provided default FixedProvider so as to extend the functionalities like that of providing hints on item selection and property follow-up and cusotm logic for performing actions.

**The getName and deserialize functions have to be overrriden by the skill developer in a similar fashion as below for the custom provider to perform as expected.**

The custom provider class can be found [here](https://github.com/alexa/skill-components/catalog-explorer/examples/BookRecommendation/lambda/provider/index.ts)
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

CatalogProviderRegistry.register(CustomProvider.NAME, CustomProvider.deserialize)
```

### Known Issues 
1. **Intializing the catalog explorer component**
   For intializing the catalog explorer component and making sure an active catalog is set before a request goes to component a custom request interceptor has been registered that run before each reuqest goes to the handler and cheks if an activeCatalog is present in the state. If the activeCatalog is not present in the session then buildCatalogReference is calld with the appropriate inputs.
   The custom request interceptor is defined in the utils file [here](https://github.com/alexa/skill-components/catalog-explorer/examples/BookRecommendation/lambda/util.ts)
    ```typescript
    export const loggingRequestInterceptor : CustomSkillRequestInterceptor = {
        process(handlerInput) {
        ...
            if(!CatalogExplorer.isActiveCatalogSet(handlerInput)) {
                CatalogExplorer.buildCatalogReference(
                    handlerInput,
                    new CustomProvider(BOOKS),
                    defaultPageSize
                )
            }
            ...
    };
    ```
2. **Dummy response and action after calling the component in main dialog**
    Becasue of the current limiation of Alexa Conversations that a main deployable dialog of a skill should return Nothing/end with response call. So to workaound this situation a dummy event call follwed with an action and a response call are added after calling the exploreCatalog() dialog of the component which return a object of type CatalogExplorationResult.
    Please refer to the main deployable dialog of the skill ACDL file [here](https://github.com/alexa/skill-components/catalog-explorer/examples/BookRecommendation/skill-package/conversations/book_recommendation.acdl#L364-L369).
    ```
    result = exploreCatalog<SearchConditions, BookItem>(config)
    expect(Invoke, dummyEvent)
    dummyAction()
    response(
        act = Notify{success = true, actionName = dummyAction},
        response = AlexaConversationsWelcome
    )
    ```

