import { HandlerInput, ResponseBuilder, AttributesManager } from 'ask-sdk-core';
import { SelectItemHandler } from "../../lambda/handlers/select-item-handler";
import { CatalogExplorer } from '../../lambda/interface';
import * as util from '../../lambda/util';
import handlerInputObject from "../resources/selectItemHandlerInput.json";
import { FixedProvider } from "../../lambda/providers/fixed-provider"
import {
    testList,
    sessionActiveCatalog,
    validSearchConditions,
    sessionProviderState,
    sessionRecommendationResultMultiItems
} from '../resources/test-common';

let handlerInput: HandlerInput;
let selectItemHandler: SelectItemHandler;

let withApiResponseMock = jest.fn(() => handlerInput.responseBuilder);
let getResponseMock = jest.fn(() => handlerInput.responseBuilder);
let withShouldEndSessionMock = jest.fn(() => handlerInput.responseBuilder);

let getSessionAttributesMock = jest.fn().mockReturnValue({
    "_ac_catalogExplorer": {
        "activeCatalog": sessionActiveCatalog,
        "providerState": sessionProviderState,
        "argsState": {
            "activeCatalog": sessionActiveCatalog,
            "recommendationResult": sessionRecommendationResultMultiItems,
            "searchConditions": validSearchConditions
        }
    }
});

let setSessionAttributesMock = jest.fn(() => handlerInput.responseBuilder);
let isApiRequestMock = jest.fn();

handlerInput = JSON.parse(JSON.stringify(handlerInputObject));

beforeEach(() => {
    jest.clearAllMocks();
    selectItemHandler = new SelectItemHandler();

    selectItemHandler.getActiveCatalog = jest.fn().mockReturnValue(sessionActiveCatalog);
    (util.isApiRequest as any) = isApiRequestMock;;
    isApiRequestMock.mockReturnValue(true);

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
        new FixedProvider(testList),
        2
    )

    jest.spyOn(console, 'error').mockImplementation(() => { });
    jest.spyOn(console, 'log').mockImplementation(() => { });
});

test('SelectItemHandler -> canHandle -> should return true when util.isApiRequest returns true', () => {
    expect(
        selectItemHandler.canHandle(handlerInput)
    ).toBe(true);
});

test('SelectItemHandler -> canHandle -> should return false when util.isApiRequest returns false', () => {
    isApiRequestMock.mockReturnValue(false);

    expect(
        selectItemHandler.canHandle(handlerInput)
    ).toBe(false);
});


test('SelectItemHandler -> handle -> should return recommendationResult with 1 item result, when input arguments are used', () => {
    CatalogExplorer.useSession = false;

    selectItemHandler.handle(handlerInput);

    expect(util.getApiArguments(handlerInput)).toMatchObject(
        {
            "catalogRef": {
                "id": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
                "catalogProviderName": "ac.FixedCatalogCursor",
                "pageSize": 2
            },
            "searchConditions": {
                "genre": "horror"
            },
            "page": {
                "items": [
                    {
                        "genre": "horror",
                        "author": "author name"
                    },
                    {
                        "genre": "comedy",
                        "author": "author name2"
                    },
                    {
                        "genre": "horror",
                        "author": "author name3"
                    }
                ],
                "itemCount": 3
            },
            "index": 1
        }
    );

    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            {
                rescoped: 0,
                searchConditions: {
                    "genre": "horror"
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

test('SelectItemHandler -> handle -> should return recommendationResult with 1 item result, when Session State is used', () => {

    CatalogExplorer.useSession = true;
    selectItemHandler.handle(handlerInput);

    expect(util.getApiArguments(handlerInput)).toMatchObject(
        {
            "catalogRef": {
                "id": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
                "catalogProviderName": "ac.FixedCatalogCursor",
                "pageSize": 2
            },
            "searchConditions": {
                "genre": "horror"
            },
            "page": {
                "items": [
                    {
                        "genre": "horror",
                        "author": "author name"
                    },
                    {
                        "genre": "comedy",
                        "author": "author name2"
                    },
                    {
                        "genre": "horror",
                        "author": "author name3"
                    }
                ],
                "itemCount": 3
            },
            "index": 1
        }
    );

    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            {
                rescoped: 0,
                searchConditions: {
                    "genre": "horror"
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

test('SelectItemHandler -> handle -> should return recommendationResult with 1 item result, when Session State is used', () => {

    CatalogExplorer.useSession = true;
    let handlerInputJson = JSON.parse(JSON.stringify(handlerInput))
    handlerInputJson.requestEnvelope.request.apiRequest.arguments.index = 4;

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

    selectItemHandler.handle(newHandlerInput);

    expect(util.getApiArguments(newHandlerInput)).toMatchObject(
        {
            "catalogRef": {
                "id": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
                "catalogProviderName": "ac.FixedCatalogCursor",
                "pageSize": 2
            },
            "searchConditions": {
                "genre": "horror"
            },
            "page": {
                "items": [
                    {
                        "genre": "horror",
                        "author": "author name"
                    },
                    {
                        "genre": "comedy",
                        "author": "author name2"
                    },
                    {
                        "genre": "horror",
                        "author": "author name3"
                    }
                ],
                "itemCount": 3
            },
            "index": 4
        }
    );

    expect(newHandlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            {
                rescoped: 0,
                searchConditions: {
                    "genre": "horror"
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

test('SelectItemHandler -> handle -> sessionState is true -> should throw error when recommendationResult is undefined', () => {

    CatalogExplorer.useSession = true;
    CatalogExplorer.useSession = true;
    let getSessionAttributesMock = jest.fn().mockReturnValue({
        "_ac_catalogExplorer": {
            "activeCatalog": sessionActiveCatalog,
            "providerState": sessionProviderState,
            "argsState": {
                "activeCatalog": sessionActiveCatalog,
                "searchConditions": validSearchConditions
            }
        }
    }
    );
    handlerInput.attributesManager = {
        getSessionAttributes: getSessionAttributesMock
    } as unknown as AttributesManager;
    // selectItemHandler.handle(handlerInput);

    expect(() => {
        selectItemHandler.handle(handlerInput)
    }).toThrow(new Error("Recommendation Result from session state in undefined"));
});