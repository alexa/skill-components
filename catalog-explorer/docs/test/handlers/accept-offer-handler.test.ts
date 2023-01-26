import { HandlerInput, ResponseBuilder, AttributesManager } from 'ask-sdk-core';
import { AcceptOfferHandler } from "../../lambda/handlers/accept-offer-handler";
import { CatalogExplorer } from '../../lambda/interface';
import * as util from '../../lambda/util';
import handlerInputPropertyObject from "../resources/acceptOfferPropertyHandlerInput.json";
import handlerInputActionObject from "../resources/acceptOfferActionHandlerInput.json";
import { FixedProvider } from "../../lambda/providers/fixed-provider"
import {
    testList,
    sessionActiveCatalog,
    sessionProviderState,
    sessionRecommendationResult
} from '../resources/test-common';

let handlerInputProperty: HandlerInput;
let handlerInputAction: HandlerInput;
let acceptOfferHandler: AcceptOfferHandler;

let withApiResponseMock = jest.fn(() => handlerInputProperty.responseBuilder);
let getResponseMock = jest.fn(() => handlerInputProperty.responseBuilder);
let withShouldEndSessionMock = jest.fn(() => handlerInputProperty.responseBuilder);

let getSessionPropertyAttributesMock = jest.fn().mockReturnValue({
    "_ac_catalogExplorer": {
        "activeCatalog": sessionActiveCatalog,
        "providerState": sessionProviderState,
        "argsState": {
            "recommendationResult": sessionRecommendationResult,
            "proactiveOffer":{
                "propertyName":"genre"
            }
        }
    }
});

let getSessionActionAttributesMock = jest.fn().mockReturnValue({
    "_ac_catalogExplorer": {
        "activeCatalog": sessionActiveCatalog,
        "providerState": sessionProviderState,
        "argsState": {
            "recommendationResult": sessionRecommendationResult,
            "proactiveOffer":{
                "actionName":"book"
            }
        }
    }
});

let setSessionAttributesMock = jest.fn(() => handlerInputProperty.responseBuilder);

let isApiRequestMock = jest.fn();

handlerInputProperty = JSON.parse(JSON.stringify(handlerInputPropertyObject));
handlerInputAction = JSON.parse(JSON.stringify(handlerInputActionObject));

beforeEach(() => {
    jest.clearAllMocks();
    acceptOfferHandler = new AcceptOfferHandler();

    acceptOfferHandler.getActiveCatalog = jest.fn().mockReturnValue(sessionActiveCatalog);

    (util.isApiRequest as any) = isApiRequestMock;
    isApiRequestMock.mockReturnValue(true);

    handlerInputProperty.responseBuilder = {
        withApiResponse: withApiResponseMock,
        getResponse: getResponseMock,
        withShouldEndSession: withShouldEndSessionMock,
    } as unknown as ResponseBuilder;

    handlerInputAction.responseBuilder = {
        withApiResponse: withApiResponseMock,
        getResponse: getResponseMock,
        withShouldEndSession: withShouldEndSessionMock,
    } as unknown as ResponseBuilder;

    handlerInputProperty.attributesManager = {
        getSessionAttributes: getSessionPropertyAttributesMock,
        setSessionAttributes: setSessionAttributesMock,
    } as unknown as AttributesManager;

    handlerInputAction.attributesManager = {
        getSessionAttributes: getSessionActionAttributesMock,
        setSessionAttributes: setSessionAttributesMock,
    } as unknown as AttributesManager;

    CatalogExplorer.buildCatalogReference(
        handlerInputProperty,
        new FixedProvider(testList),
        3
    )

    jest.spyOn(console, 'error').mockImplementation(() => { });
    jest.spyOn(console, 'log').mockImplementation(() => { });
});

test('AcceptOfferHandler -> canHandle -> should return true when util.isApiRequest returns true', () => {
    expect(
        acceptOfferHandler.canHandle(handlerInputProperty)
    ).toBe(true);
});

test('AcceptOfferHandler -> canHandle -> should return false when util.isApiRequest returns false', () => {
    isApiRequestMock.mockReturnValue(false);

    expect(
        acceptOfferHandler.canHandle(handlerInputProperty)
    ).toBe(false);
});

test('AcceptOfferHandler -> handle -> should return correct action value result when input arguments are used', () => {
    CatalogExplorer.useSession = false;
    acceptOfferHandler.handle(handlerInputAction);

    expect(util.getApiArguments(handlerInputAction)).toMatchObject(
        {
            "catalogRef": {
                "id": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
                "catalogProviderName": "ac.FixedCatalogCursor",
                "pageSize": 3
            },
            "items": [
                {
                    "genre": "horror",
                    "author": "author name"
                }
            ],
            "proactiveOffer":{
                "actionName":"book"
            }
        }
    );

    expect(handlerInputAction.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            {
                    offer : {
                        "actionName":"book"
                    },
                    actionResult: "Result: Action successfully performed"
            }
        );
});

test('AcceptOfferHandler -> handle -> should return correct action value result when Session State is used', () => {

    CatalogExplorer.useSession = true;
    acceptOfferHandler.handle(handlerInputAction);

    expect(util.getApiArguments(handlerInputAction)).toMatchObject(
        {
            "catalogRef": {
                "id": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
                "catalogProviderName": "ac.FixedCatalogCursor",
                "pageSize": 3
            },
            "items": [
                {
                    "genre": "horror",
                    "author": "author name"
                }
            ],
            "proactiveOffer":{
                "actionName":"book"
            }
        }
    );

    expect(handlerInputAction.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            {
                    offer : {
                        "actionName":"book"
                    },
                    actionResult: "Result: Action successfully performed"
            }
        );
});

test('AcceptOfferHandler -> handle -> should return correct property value result when input arguments are used', () => {
    CatalogExplorer.useSession = false;
    acceptOfferHandler.handle(handlerInputProperty);

    expect(util.getApiArguments(handlerInputProperty)).toMatchObject(
        {
            "catalogRef": {
                "id": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
                "catalogProviderName": "ac.FixedCatalogCursor",
                "pageSize": 3
            },
            "items": [
                {
                    "genre": "horror",
                    "author": "author name"
                }
            ],
            "proactiveOffer":{
                "propertyName":"genre"
            }
        }
    );

    expect(handlerInputProperty.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            {
                    offer : {
                        "propertyName":"genre"
                    },
                    propertyValue: "horror"
            }
        );
});

test('AcceptOfferHandler -> handle -> should return correct property value result when Session State is used', () => {

    CatalogExplorer.useSession = true;
    acceptOfferHandler.handle(handlerInputProperty);

    expect(util.getApiArguments(handlerInputProperty)).toMatchObject(
        {
            "catalogRef": {
                "id": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
                "catalogProviderName": "ac.FixedCatalogCursor",
                "pageSize": 3
            },
            "items": [
                {
                    "genre": "horror",
                    "author": "author name"
                }
            ],
            "proactiveOffer":{
                "propertyName":"genre"
            }
        }
    );

    expect(handlerInputProperty.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            {
                    offer : {
                        "propertyName":"genre"
                    },
                    propertyValue: "horror"
            }
        );
});