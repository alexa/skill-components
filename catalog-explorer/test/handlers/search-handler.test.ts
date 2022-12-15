import { HandlerInput, ResponseBuilder, AttributesManager } from 'ask-sdk-core';
import { SearchHandler } from "../../lambda/handlers/search-handler";
import { CatalogExplorer } from '../../lambda/interface';
import * as util from '../../lambda/util';
import handlerInputObject from "../resources/searchHandlerInput.json";
import { FixedProvider } from "../../lambda/providers/fixed-provider"
import {
    testList,
    sessionActiveCatalog,
    sessionProviderState,
    validSearchConditions
} from '../resources/test-common';

let handlerInput: HandlerInput;
let searchHandler: SearchHandler;

let withApiResponseMock = jest.fn(() => handlerInput.responseBuilder);
let getResponseMock = jest.fn(() => handlerInput.responseBuilder);
let withShouldEndSessionMock = jest.fn(() => handlerInput.responseBuilder);

let getSessionAttributesMock = jest.fn().mockReturnValue({
    "_ac_catalogExplorer": {
        "activeCatalog": sessionActiveCatalog,
        "providerState": sessionProviderState,
        "argsState": {
            "searchConditions": validSearchConditions
        }
    }
}
);

let setSessionAttributesMock = jest.fn(() => handlerInput.responseBuilder);
let isApiRequestPrefixMock = jest.fn();
handlerInput = JSON.parse(JSON.stringify(handlerInputObject));

beforeEach(() => {
    jest.clearAllMocks();
    searchHandler = new SearchHandler();

    searchHandler.getActiveCatalog = jest.fn().mockReturnValue(sessionActiveCatalog);
    (util.isApiRequestPrefix as any) = isApiRequestPrefixMock;
    isApiRequestPrefixMock.mockReturnValue(true);

    handlerInput.responseBuilder = {
        withApiResponse: withApiResponseMock,
        getResponse: getResponseMock,
        withShouldEndSession: withShouldEndSessionMock,
    } as unknown as ResponseBuilder;

    handlerInput.attributesManager = {
        getSessionAttributes: getSessionAttributesMock,
        setSessionAttributes: setSessionAttributesMock,
    } as unknown as AttributesManager;

    CatalogExplorer.buildCatalogReference(
        handlerInput,
        new FixedProvider(testList,[],0),
        2
    )

    jest.spyOn(console, 'error').mockImplementation(() => { });
    jest.spyOn(console, 'log').mockImplementation(() => { });
});

test('SearchHandler -> canHandle -> should return true when util.isApiRequestPrefix returns true', () => {
    expect(
        searchHandler.canHandle(handlerInput)
    ).toBe(true);
});

test('SearchHandler -> canHandle -> should return false when util.isApiRequestPrefix returns false', () => {
    isApiRequestPrefixMock.mockReturnValue(false);

    expect(
        searchHandler.canHandle(handlerInput)
    ).toBe(false);
});


test('SearchHandler -> handle -> should return correct recommendation result when handlerInput argument is used', () => {
    CatalogExplorer.useSession = false;
    searchHandler.handle(handlerInput);

    expect(util.getApiArguments(handlerInput)).toMatchObject(
        {
            "catalogRef":{
                "id": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
                "catalogProviderName": "ac.FixedCatalogCursor",
                "pageSize": 2

            },
            "searchConditions":{
                "genre":"horror"
            }
        }
    );

    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            {
                rescoped: 0,
                searchConditions: {},
                recommendations: {
                    items: [
                        {
                            "genre": "horror",
                            "author": "author name"
                        },
                        {
                            "genre": "comedy",
                            "author": "author name2"
                        }
                    ],
                    itemCount: 2,
                    prevPageToken: undefined,
                    nextPageToken: "2"
                }
            }
        );
});

test('SearchHandler -> handle -> should return correct recommendation result result when Session State is used', () => {

    CatalogExplorer.useSession = true;
    searchHandler.handle(handlerInput);

    expect(util.getApiArguments(handlerInput)).toMatchObject(
        {
            "catalogRef": {
                "id": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
                "catalogProviderName": "ac.FixedCatalogCursor",
                "pageSize": 2

            }
        }
    );

    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            {
                rescoped: 0,
                searchConditions: {},
                recommendations: {
                    items: [
                        {
                            "genre": "horror",
                            "author": "author name"
                        },
                        {
                            "genre": "comedy",
                            "author": "author name2"
                        }
                    ],
                    itemCount: 2,
                    prevPageToken: undefined,
                    nextPageToken: "2"
                }
            }
        );
});

test('SearchHandler -> handle -> refineSearch -> should return correct recommendation result result when Session State is used', () => {
    CatalogExplorer.useSession = false;
    let handlerInputJson = JSON.parse(JSON.stringify(handlerInput));
    (util.getResolvedApiSlotValues as any) = jest.fn().mockReturnValue({"author":"author name"});

    handlerInputJson.requestEnvelope.request.apiRequest.name = "com.amazon.alexa.skill.components.catalog_explorer.search_refine";
    handlerInputJson.requestEnvelope.request.apiRequest.arguments.searchConditions = { "author":"author name" };

    let newHandlerInput: HandlerInput = handlerInputJson;
    newHandlerInput.responseBuilder = {
        withApiResponse: withApiResponseMock,
        getResponse: getResponseMock,
        withShouldEndSession: withShouldEndSessionMock,
    } as unknown as ResponseBuilder;

    newHandlerInput.attributesManager = {
        getSessionAttributes: getSessionAttributesMock,
        setSessionAttributes: setSessionAttributesMock,
    } as unknown as AttributesManager;

    searchHandler.handle(newHandlerInput);

    expect(util.getApiArguments(newHandlerInput)).toMatchObject(
        {
            "catalogRef":{
                "id": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
                "catalogProviderName": "ac.FixedCatalogCursor",
                "pageSize": 2

            },
            "searchConditions":{
                "author": "author name"
            }
        }
    );

    expect(newHandlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            {   
                offer: undefined,
                rescoped: 0,
                searchConditions: {
                    "author": "author name",
                    "genre": "horror",
                },
                recommendations: {
                    items: [
                        {
                            "genre": "horror",
                            "author": "author name"
                        }
                    ],
                    itemCount: 1,
                    prevPageToken: undefined,
                    nextPageToken: undefined
                }
            }
        );
});

test('SearchHandler -> handle -> should throw error if apiName is not correct', () => {
    let handlerInputJson = JSON.parse(JSON.stringify(handlerInput))
    handlerInputJson.requestEnvelope.request.apiRequest.name = "com.amazon.alexa.skill.components.catalog_explorer.search_";

    let newHandlerInput: HandlerInput = handlerInputJson;
    expect(() => {
        searchHandler.handle(newHandlerInput)
    }).toThrow(new Error("Search Type fetched from API is incorrect"));
});

test('SearchHandler -> handle -> should throw error if apiName is not defined', () => {
    let handlerInputJson = JSON.parse(JSON.stringify(handlerInput))
    handlerInputJson.requestEnvelope.request.apiRequest.name = undefined;

    let newHandlerInput: HandlerInput = handlerInputJson;
    expect(() => {
        searchHandler.handle(newHandlerInput)
    }).toThrow(new Error("Search Type fetched from API is incorrect"));
});