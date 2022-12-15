import { HandlerInput, ResponseBuilder, AttributesManager } from 'ask-sdk-core';
import { RecordNextEventHandler } from "../../lambda/handlers/record-next-event";
import { CatalogExplorer } from '../../lambda/interface';
import * as util from '../../lambda/util';
import handlerInputObject from "../resources/recordNextEventHandlerInput.json";
import { FixedProvider } from "../../lambda/providers/fixed-provider"
import {
    testList,
    sessionActiveCatalog,
    sessionProviderState
} from '../resources/test-common';

let handlerInput: HandlerInput;
let recordNextEventHandler: RecordNextEventHandler;

let withApiResponseMock = jest.fn(() => handlerInput.responseBuilder);
let getResponseMock = jest.fn(() => handlerInput.responseBuilder);
let withShouldEndSessionMock = jest.fn(() => handlerInput.responseBuilder);


let getSessionAttributesMock = jest.fn().mockReturnValue({
    "_ac_catalogExplorer": {
        "activeCatalog": sessionActiveCatalog,
        "providerState": sessionProviderState,
        "argsState": {
            "currentPageSize":2,
            "currentPageTokens": {
                prevPageToken: undefined,
                currentPageToken: undefined,
                nextPageToken: undefined
            }
        }
    }
});

let setSessionAttributesMock = jest.fn(() => handlerInput.responseBuilder);

let isApiRequestMock = jest.fn();

handlerInput = JSON.parse(JSON.stringify(handlerInputObject));

beforeEach(() => {
    jest.clearAllMocks();
    recordNextEventHandler = new RecordNextEventHandler();
    recordNextEventHandler.getActiveCatalog = jest.fn().mockReturnValue(sessionActiveCatalog);
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

test('RecordNextEventHandler -> canHandle -> should return true when util.isApiRequest returns true', () => {
    expect(
        recordNextEventHandler.canHandle(handlerInput)
    ).toBe(true);
});

test('RecordNextEventHandler -> canHandle -> should return false when util.isApiRequest returns false', () => {
    isApiRequestMock.mockReturnValue(false);

    expect(
        recordNextEventHandler.canHandle(handlerInput)
    ).toBe(false);
});


test('RecordNextEventHandler -> handle -> should return correct api response', () => {

    CatalogExplorer.useSession = true;
    recordNextEventHandler.handle(handlerInput);
    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith({});
});

test('RecordNextEventHandler -> handle -> should throw error when currentPageToken is undefined', () => {

    CatalogExplorer.useSession = true;
    let getSessionAttributesMock = jest.fn().mockReturnValue({
        "_ac_catalogExplorer": {
            "activeCatalog": sessionActiveCatalog,
            "providerState": sessionProviderState,
            "argsState": {
            }
        }
    }
    );
    handlerInput.attributesManager = {
        getSessionAttributes: getSessionAttributesMock
    } as unknown as AttributesManager;

    expect(() => {
        recordNextEventHandler.handle(handlerInput)
    }).toThrow(new Error("No current page info in catalog explorer session state"));
});