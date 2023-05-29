# Scheduling Component Recipes

## Create a custom Scheduling provider

By default, the Scheduling component supplies a sample provider, which is an implementation of the [SchedulingProvider interface](https://github.com/alexa/skill-components/tree/main/scheduling/lambda/provider.ts#L12-L31). To customize it, simply define your own provider class in your Lambda function, and implement `SchedulingProvider` with the following functions.

```typescript

import { ProviderRegistry, SchedulingProvider, SchedulingResult} from '@alexa-skill-components/scheduling';

export class CustomProvider implements SchedulingProvider<any>{
    public static NAME = "ac.customProvider";

    constructor() {
        //constructor implemenatation logic
    }

    schedule(
        schedulingInfo: SchedulingInfo
    ): SchedulingResult | Promise<SchedulingResult>{
        //custom logic for schedule
    }
    
    showBookingsListProvider(): ListProvider<any>{
        //custom logic for showBookingsListProvider
    }
    
    modify(
        newSchedulingInfo: SchedulingInfo,
        prevSchedulingInfo?: SchedulingInfo
    ): SchedulingResult | Promise<SchedulingResult>{
        //custom logic for modify
    }
    
    cancel(
        schedulingInfo: SchedulingInfo
    ): SchedulingResult | Promise<SchedulingResult>{
        //custom logic for cancel
    }

    serialize(): any {
        //custom logic for serialize
    }

    getName(): string {
        return CustomProvider.NAME;
    }

    static deserialize(config: any): CustomProvider {
        return new CustomProvider(/*arguments from config*/);
    }
}

ProviderRegistry.register(CustomProvider.NAME, CustomProvider.deserialize);
```

## Create a custom ListProvider to use with the component

To let the user browse and select from a list of reservations, the component consumes the existing [ListNavigation component](https://github.com/alexa/skill-components/tree/main/list-navigation). Therefore, by definition, the `showBookingsListProvider` provider method returns a [ListProvider](https://github.com/alexa/skill-components/blob/main/list-navigation/docs/REFERENCE.md#interface-listprovider) object. You can use either use one of the [List Providers](https://github.com/alexa/skill-components/blob/main/list-navigation/docs/REFERENCE.md#class-ddblistprovider) bundled with the `ListNavigation` skill component, or create your own [custom ListProvider](https://github.com/alexa/skill-components/blob/main/list-navigation/docs/RECIPES.md#creating-a-custom-list-provider).

### Use the existing DynamoDBListProvider class

Alternatively, to create a custom `ListProvider`, you can use the existing [DynamoDBListProvider](https://github.com/alexa/skill-components/blob/main/list-navigation/docs/REFERENCE.md#class-ddblistprovider) class.

```typescript

import { ProviderRegistry, SchedulingProvider, SchedulingResult} from '@alexa-skill-components/scheduling';
import { DDBListProvider, ListProvider, FixedListProvider } from '@alexa-skill-components/list-navigation';


export class CustomProvider implements SchedulingProvider<any>{
    public static NAME = "ac.customProvider";

    constructor() {
        //constructor implemenatation logic
    }

    schedule(
        schedulingInfo: SchedulingInfo
    ): SchedulingResult | Promise<SchedulingResult>{
        //custom logic for schedule
    }
    
    showBookingsListProvider(): ListProvider<any>{
        // using the existing DDBListProvider
        const providerObject = new DDBListProvider("aws region", "DynamoDB table name");
        return providerObject;
    }
    
    modify(
        newSchedulingInfo: SchedulingInfo,
        prevSchedulingInfo?: SchedulingInfo
    ): SchedulingResult | Promise<SchedulingResult>{
        //custom logic for modify
    }
    
    cancel(
        schedulingInfo: SchedulingInfo
    ): SchedulingResult | Promise<SchedulingResult>{
        //custom logic for cancel
    }

    serialize(): any {
        //custom logic for serialize
    }

    getName(): string {
        return CustomProvider.NAME;
    }

    static deserialize(config: any): CustomProvider {
        return new CustomProvider(/*arguments from config*/);
    }
}

ProviderRegistry.register(CustomProvider.NAME, CustomProvider.deserialize);

## Customize page size for ShowBookings

By default, the component uses a page size of 3 when the user asks Alexa to show the existing reservations. To 
customize this view, simply define your own page size, and send it in the pageSize argument when you call the `buildSchedulingReference` function in your lambda code.

```typescript

import { SchedulingComponent, DefaultSchedulingProvider} from
    '@alexa-skill-components/scheduling';
    
const pageSize = 3; //represents the number of items to be displayed in each show bookings page

SchedulingComponent.buildSchedulingReference(
                handlerInput,
                new CustomProvider("us-east-1", "restaurantBookings"),
                pageSize
            )
```
