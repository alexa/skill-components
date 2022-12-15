import { HandlerInput, ResponseBuilder, AttributesManager } from 'ask-sdk-core';
import { GetPropertyHandler } from "../../lambda/handlers/get-property-handler";
import { CatalogExplorer } from '../../lambda/interface';
import * as util from '../../lambda/util';
import handlerInputObject from "../resources/getPropertyHandlerInput.json";
import { FixedProvider } from "../../lambda/providers/fixed-provider"
import {
    testList,
    sessionActiveCatalog,
    sessionProviderState,
    sessionRecommendationResult
} from '../resources/test-common';

let handlerInput: HandlerInput;
let getPropertyHandler: GetPropertyHandler;

let withApiResponseMock = jest.fn(() => handlerInput.responseBuilder);
let getResponseMock = jest.fn(() => handlerInput.responseBuilder);
let withShouldEndSessionMock = jest.fn(() => handlerInput.responseBuilder);

let getSessionAttributesMock = jest.fn().mockReturnValue({
    "_ac_catalogExplorer": {
        "activeCatalog": sessionActiveCatalog,
        "providerState": sessionProviderState,
        "argsState": {
            "recommendationResult": sessionRecommendationResult
        }
    }
});

let setSessionAttributesMock = jest.fn();

let isApiRequestPrefixMock = jest.fn();

handlerInput = JSON.parse(JSON.stringify(handlerInputObject));

beforeEach(() => {
    jest.clearAllMocks();
    getPropertyHandler = new GetPropertyHandler();
    getPropertyHandler.getActiveCatalog = jest.fn().mockReturnValue(sessionActiveCatalog);
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
        new FixedProvider(testList),
        2
    )

    jest.spyOn(console, 'error').mockImplementation(() => { });
    jest.spyOn(console, 'log').mockImplementation(() => { });
});

test('GetPropertyHandler -> canHandle -> should return true when util.isApiRequestPrefix returns true', () => {
    expect(
        getPropertyHandler.canHandle(handlerInput)
    ).toBe(true);
});

test('GetPropertyHandler -> canHandle -> should return false when util.isApiRequestPrefix returns false', () => {
    isApiRequestPrefixMock.mockReturnValue(false);

    expect(
        getPropertyHandler.canHandle(handlerInput)
    ).toBe(false);
});


test('GetPropertyHandler -> handle -> should return correct property value result when handlerInput argument is used', () => {
    CatalogExplorer.useSession = false;
    getPropertyHandler.handle(handlerInput);

    expect(util.getApiArguments(handlerInput)).toMatchObject(
        {
            "catalogRef": {
                "id": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
                "catalogProviderName": "ac.FixedCatalogCursor",
                "pageSize": 2

            },
            "items": [
                {
                    "genre": "horror",
                    "author": "author name"
                }
            ]
        }
    );

    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            {
                value: "horror",
                propertyName: "genre",
                offer: undefined,
                items: [
                    {
                        "author": "author name",
                        "genre": "horror",
                    }
                ]
            }
        );
});

test('GetPropertyHandler -> handle -> should return correct property value result when Session State is used', () => {
    CatalogExplorer.useSession = true;
    getPropertyHandler.handle(handlerInput);

    expect(util.getApiArguments(handlerInput)).toMatchObject(
        {
            "catalogRef": {
                "id": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
                "catalogProviderName": "ac.FixedCatalogCursor",
                "pageSize": 2

            },
            "items": [
                {
                    "genre": "horror",
                    "author": "author name"
                }
            ]
        }
    );

    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            {
                value: "horror",
                propertyName: "genre",
                offer: undefined,
                items: [
                    {
                        "author": "author name",
                        "genre": "horror",
                    }
                ]
            }
        );
});

test('GetPropertyHandler -> handle -> should throw error if propertyName is null', () => {

    let handlerInputJson = JSON.parse(JSON.stringify(handlerInput))
    handlerInputJson.requestEnvelope.request.apiRequest.name = "com.amazon.alexa.skill.components.catalog_explorer.getProperty_";

    let newHandlerInput: HandlerInput = handlerInputJson;
    expect(() => {
        getPropertyHandler.handle(newHandlerInput)
    }).toThrow(new Error("Property Name cannot be fetched from API"));
});