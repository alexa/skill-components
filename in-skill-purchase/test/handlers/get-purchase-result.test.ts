import { AttributesManager, HandlerInput, ResponseBuilder } from 'ask-sdk-core';
import { mock, when, instance, deepEqual } from "ts-mockito";
import { Constants } from "../../lambda/util/Constants";
import { GetPurchaseResultHandler } from "../../lambda/handlers/get-purchase-result";
import { UtilsHelper } from '../../lambda/util/Helper';
import handlerInputObject from "../resources/sendBuyDirectiveHandlerInput.json";
import { ISPResponseSession } from '../../lambda/models/ISPResponseSession';
 
let handlerInput: HandlerInput;
let getPurchaseResultHandler: GetPurchaseResultHandler;
 
let withApiResponseMock = jest.fn(() => handlerInput.responseBuilder);
let getResponseMock = jest.fn(() => handlerInput.responseBuilder);
let withShouldEndSessionMock = jest.fn(() => handlerInput.responseBuilder);
let addDirectiveMock = jest.fn(() => handlerInput.responseBuilder);
let mockGetSessionAttributes = jest.fn();
let mockSetSessionAttributes = jest.fn();
const isApiRequestMock = jest.fn();
 
handlerInput = JSON.parse(JSON.stringify(handlerInputObject)) as HandlerInput
 
beforeEach(() => {
    jest.clearAllMocks();
     
    getPurchaseResultHandler = new GetPurchaseResultHandler();
 
    UtilsHelper.prototype.isApiRequest = isApiRequestMock;
    isApiRequestMock.mockReturnValue(true);
 
    handlerInput.responseBuilder = {
        withApiResponse: withApiResponseMock,
        getResponse: getResponseMock,
        withShouldEndSession: withShouldEndSessionMock,
        addDirective: addDirectiveMock
    } as unknown as ResponseBuilder;

    handlerInput.attributesManager = {
        getSessionAttributes: mockGetSessionAttributes,
        setSessionAttributes: mockSetSessionAttributes
    } as unknown as AttributesManager;

    mockGetSessionAttributes.mockReturnValue({
        name: "Buy",
        purchaseResult: "ACCEPTED"
    } as ISPResponseSession);
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
});
 
test('GetPurchaseResultHandler -> canHandle -> should return true when UtilHelper.isApiRequest returns true', () => {
    expect(
        getPurchaseResultHandler.canHandle(handlerInput)
    ).toBe(true);
});
 
test('GetPurchaseResultHandler -> canHandle -> should return false when UtilHelper.isApiRequest returns false', () => {
    isApiRequestMock.mockReturnValue(false);
 
    expect(
        getPurchaseResultHandler.canHandle(handlerInput)
    ).toBe(false);
});
 
 
test('GetPurchaseResultHandler -> handle -> should return purchase result from session attributes', async () => {
    await getPurchaseResultHandler.handle(handlerInput);
 
    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            { 
                name: "Buy",
                status: "ACCEPTED"
            }
        );
});