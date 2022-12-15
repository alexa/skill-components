// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

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

//Register the custom provider
CatalogProviderRegistry.register(CustomProvider.NAME, CustomProvider.deserialize)