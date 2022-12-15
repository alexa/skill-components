import { HandlerInput, ResponseBuilder, AttributesManager } from 'ask-sdk-core';
import { PerformActionHandler } from "../../lambda/handlers/perform-action-handler";
import { CatalogExplorer } from '../../lambda/interface';
import * as util from '../../lambda/util';
import handlerInputObject from "../resources/performActionHandlerInput.json";
import { FixedProvider } from "../../lambda/providers/fixed-provider"
import {
    testList,
    sessionActiveCatalog,
    sessionProviderState,
    sessionRecommendationResult
} from '../resources/test-common';

let handlerInput: HandlerInput;
let performActionHandler: PerformActionHandler;

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

let setSessionAttributesMock = jest.fn(() => handlerInput.responseBuilder);

let isApiRequestPrefixMock = jest.fn();

handlerInput = JSON.parse(JSON.stringify(handlerInputObject));

beforeEach(() => {
    jest.clearAllMocks();
    performActionHandler = new PerformActionHandler();
    performActionHandler.getActiveCatalog = jest.fn().mockReturnValue(sessionActiveCatalog);
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

test('PerformActionHandler -> canHandle -> should return true when util.isApiRequestPrefix returns true', () => {
    expect(
        performActionHandler.canHandle(handlerInput)
    ).toBe(true);
});

test('PerformActionHandler -> canHandle -> should return false when util.isApiRequestPrefix returns false', () => {
    isApiRequestPrefixMock.mockReturnValue(false);

    expect(
        performActionHandler.canHandle(handlerInput)
    ).toBe(false);
});


test('PerformActionHandler -> handle -> should return correct action result when input arguments are used', () => {

    CatalogExplorer.useSession = false;
    performActionHandler.handle(handlerInput);

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
                result: "Result: Action successfully performed",
                actionName: "book"
            }
        );
});

test('PerformActionHandler -> handle -> should return correct action result when Session State is used', () => {

    CatalogExplorer.useSession = true;
    performActionHandler.handle(handlerInput);

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
                result: "Result: Action successfully performed",
                actionName: "book"
            }
        );
});

test('PerformActionHandler -> handle -> should throw error if actionName is null', () => {

    let handlerInputJson = JSON.parse(JSON.stringify(handlerInput))
    handlerInputJson.requestEnvelope.request.apiRequest.name = "com.amazon.alexa.skill.components.catalog_explorer.performAction_";

    let newHandlerInput: HandlerInput = handlerInputJson;

    expect(() => {
        performActionHandler.handle(newHandlerInput)
    }).toThrow(new Error("Action Name cannot be fetched from API"));
});