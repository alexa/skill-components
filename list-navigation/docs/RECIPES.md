# List Navigation Explorer Recipes

## Setup the Fixed List Provider
In the handler for the action you defined to return a list reference, you can use the [`FixedListProvider`](./REFERENCE.md#class-fixedlistprovider) class bundled with the component to generate the list reference that is passed into the component.

```typescript
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

## Setup the DDB List Provider
In the handler for the action you defined to return a list reference, you can use the [`DDBListProvider`](./REFERENCE.md#class-ddblistprovider) class bundled with the component to generate the list reference that is passed into the component.

Note: Ensure the lambda function has READ access to the DynamoDB table, to use this list provider.

```typescript
import { Utils, ListNav, DDBListProvider } from '@alexa-skill-components/list-navigation';

...
region = "us-east-1"; // aws region where the DynamoDB table is hosted
tableName = "BooksTable"; // name of the DynamoDB table
defaultPageSize = 3; // allowed sizes: 1-5

export class GetBooksHandler implements RequestHandler {
    canHandle(handlerInput : HandlerInput) : boolean {
        return Utils.isApiRequest(handlerInput, `examples.books_nav.getBooks`);
	}

    handle(handlerInput: HandlerInput) {
        const listRef = ListNav.buildListReference(
            handlerInput,
            new DDBListProvider(region,tableName),
            defaultPageSize
        );

        return handlerInput.responseBuilder
            .withApiResponse(listRef)
            .withShouldEndSession(false)
            .getResponse();
    }
}
```

## Creating a custom List Provider

By default, the component uses a FixedListProvider provider which is an implementation of [ListProvider interface](./REFERENCE.md#interface-listprovider). To customize this, simply define your own provider class implementing ListProvider with the functions as defined below in your lambda code.


```typescript
import { ListProvider, ListProviderRegistry, Page, PageToken, PagingDirection } from '../list-provider';

export class CustomProvider<T> implements ListProvider<T>{
    //give a name to the custom provider so as to register it in the list provider registry
    public static NAME = "customProvider";

    constructor() {
        //constructor implementation logic
    }

    getPage(
        pageToken: PageToken | undefined,
        pageSize: number,
        pagingDirection: PagingDirection | undefined
    ): Promise<Page<T>> {
        //custom logic for getPage method
    }

    serialize(): any {
        //custom logic for serialize
    }

    //must override this function to implement custom functionlity
    getName(): string {
        return CustomProvider.NAME;
    }

    //must implement this function to implement custom functionality
    static deserialize(data: any): CustomProvider<any>{
        //implementation will depend on constructor arguments
        return new CustomProvider(data);
    }
}
//must register the custom provider in the ListProviderRegistry
ListProviderRegistry.register(CustomProvider.NAME, CustomProvider.deserialize);
```

## Customizing Page Size

By default, the component uses page size as 3 for displaying the number of items in a single page of items. To 
customize this, simply define your own page size and sent it in the [pageSize](./REFERENCE.md#methods) argument when calling the [`buildListReference`](./REFERENCE.md#methods) function in your lambda code:

For reference: [default page size implementation](https://github.com/alexa/skill-components/blob/main/list-navigation/lambda/interface.ts#L60)

```typescript
import { ListNav, FixedListProvider } from '@alexa-skill-components/list-navigation';
const pageSize = 4; // page size that will be used for navigation
ListNav.buildListReference(
    handlerInput,
    new FixedListProvider(data),
    pageSize
)
```