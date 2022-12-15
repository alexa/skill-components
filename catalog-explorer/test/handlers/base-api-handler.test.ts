import { HandlerInput, ResponseBuilder, AttributesManager } from 'ask-sdk-core';
import { BaseApiHandler } from "../../lambda/handlers/base-api-handler";
import * as util from '../../lambda/util';
import handlerInputObject from "../resources/baseApiHandlerInput.json";
import { apiNamespace } from '../../lambda/config';


let handlerInput: HandlerInput;

let withApiResponseMock = jest.fn(() => handlerInput.responseBuilder);
let getResponseMock = jest.fn(() => handlerInput.responseBuilder);
let withShouldEndSessionMock = jest.fn(() => handlerInput.responseBuilder);
let getSessionAttributesMock = jest.fn(() => handlerInput.responseBuilder);
let setSessionAttributesMock = jest.fn(() => handlerInput.responseBuilder);

let isApiRequestMock = jest.fn();

handlerInput = JSON.parse(JSON.stringify(handlerInputObject));

class BaseApiHandlerClass extends BaseApiHandler {
    handle(handlerInput : HandlerInput) {
        return {};
    }
}

beforeEach(() => {
    jest.clearAllMocks();
    (util.isApiRequestPrefix as any) = isApiRequestMock;
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
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
});

test('baseApiHandler -> canHandle -> should return true when util.isApiRequest returns true', () => {
    let baseApiHandlerClass = new BaseApiHandlerClass(`${apiNamespace}.baseApiClass`);
    expect(
        baseApiHandlerClass.canHandle(handlerInput)
    ).toBe(true);
});

test('baseApiHandler -> canHandle -> should return false when util.isApiRequest returns false', () => {
    let baseApiHandlerClass = new BaseApiHandlerClass(`${apiNamespace}.baseApiClasss`);
    isApiRequestMock.mockReturnValue(false);
    expect(
        baseApiHandlerClass.canHandle(handlerInput)
    ).toBe(false);
});