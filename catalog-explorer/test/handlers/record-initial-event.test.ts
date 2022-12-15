import { HandlerInput, ResponseBuilder, AttributesManager } from 'ask-sdk-core';
import { RecordInitialEventHandler } from "../../lambda/handlers/record-initial-event";
import { CatalogExplorer } from '../../lambda/interface';
import * as util from '../../lambda/util';
import handlerInputObject from "../resources/recordInitialEventHandlerInput.json";
import { FixedProvider } from "../../lambda/providers/fixed-provider"
import {
    testList,
    sessionActiveCatalog,
    sessionProviderState,
    validSearchConditions
} from '../resources/test-common';

let handlerInput: HandlerInput;
let recordInitialEventHandler: RecordInitialEventHandler;

let withApiResponseMock = jest.fn(() => handlerInput.responseBuilder);
let getResponseMock = jest.fn(() => handlerInput.responseBuilder);
let withShouldEndSessionMock = jest.fn(() => handlerInput.responseBuilder);

let getSessionAttributesMock = jest.fn().mockReturnValue({
    "_ac_catalogExplorer": {
        "activeCatalog": sessionActiveCatalog,
        "providerState": sessionProviderState,
        "argsState": {
            "upcomingPageToken":"0",
            "searchConditions":validSearchConditions,
            "currentPageSize":2
        }
    }
});

let setSessionAttributesMock = jest.fn(() => handlerInput.responseBuilder);

let isApiRequestMock = jest.fn();

handlerInput = JSON.parse(JSON.stringify(handlerInputObject));

beforeEach(() => {
    jest.clearAllMocks();
    recordInitialEventHandler = new RecordInitialEventHandler();

    recordInitialEventHandler.getActiveCatalog = jest.fn().mockReturnValue(sessionActiveCatalog);

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

test('RecordInitialEventHandler -> canHandle -> should return true when util.isApiRequest returns true', () => {
    expect(
        recordInitialEventHandler.canHandle(handlerInput)
    ).toBe(true);
});

test('RecordInitialEventHandler -> canHandle -> should return false when util.isApiRequest returns false', () => {
    isApiRequestMock.mockReturnValue(false);

    expect(
        recordInitialEventHandler.canHandle(handlerInput)
    ).toBe(false);
});


test('RecordInitialEventHandler -> handle -> should return correct api response', () => {

    CatalogExplorer.useSession = true;
    recordInitialEventHandler.handle(handlerInput);
    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith({});
});