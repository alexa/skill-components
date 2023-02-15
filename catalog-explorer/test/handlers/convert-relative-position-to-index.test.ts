import { HandlerInput, ResponseBuilder, AttributesManager } from 'ask-sdk-core';
import { ConvertRelativePositionToIndexHandler } from "../../lambda/handlers/convert-relative-position-to-index";
import { CatalogExplorer } from '../../lambda/interface';
import * as util from '../../lambda/util';
import handlerInputObject from "../resources/convertRelativePositionToIndexHandlerInput.json";
import { FixedProvider } from "../../lambda/providers/fixed-provider"
import {
    testList,
    sessionActiveCatalog,
    sessionProviderState
} from '../resources/test-common';

let handlerInput: HandlerInput;
let convertRelativePositionToIndexHandler: ConvertRelativePositionToIndexHandler;

let withApiResponseMock = jest.fn(() => handlerInput.responseBuilder);
let getResponseMock = jest.fn(() => handlerInput.responseBuilder);
let withShouldEndSessionMock = jest.fn(() => handlerInput.responseBuilder);

let getSessionAttributesMock = jest.fn().mockReturnValue({
    "_ac_catalogExplorer": {
        "activeCatalog": sessionActiveCatalog,
        "providerState": sessionProviderState,
        "argsState": {}
    }
}
);

let setSessionAttributesMock = jest.fn(() => handlerInput.responseBuilder);

let isApiRequestMock = jest.fn();

handlerInput = JSON.parse(JSON.stringify(handlerInputObject));

beforeEach(() => {
    jest.clearAllMocks();
    convertRelativePositionToIndexHandler = new ConvertRelativePositionToIndexHandler();
    convertRelativePositionToIndexHandler.getActiveCatalog = jest.fn().mockReturnValue(sessionActiveCatalog);


    (util.isApiRequest as any) = isApiRequestMock;
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

test('ConvertRelativePositionToIndexHandler -> canHandle -> should return true when util.isApiRequest returns true', () => {
    expect(
        convertRelativePositionToIndexHandler.canHandle(handlerInput)
    ).toBe(true);
});

test('ConvertRelativePositionToIndexHandler -> canHandle -> should return false when util.isApiRequest returns false', () => {
    isApiRequestMock.mockReturnValue(false);

    expect(
        convertRelativePositionToIndexHandler.canHandle(handlerInput)
    ).toBe(false);
});


test('ConvertRelativePositionToIndexHandler -> handle -> should return correct property value result', () => {

    convertRelativePositionToIndexHandler.handle(handlerInput);
    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(1);
});