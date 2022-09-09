import { AttributesManager, HandlerInput, ResponseBuilder } from 'ask-sdk-core';
import { mock, when, instance, deepEqual } from "ts-mockito";
import { Constants } from "../../lambda/util/Constants";
import { ResumeResponseHandler } from "../../lambda/handlers/resume-response";
import { UtilsHelper } from '../../lambda/util/Helper';
import handlerInputObject from "../resources/resumeResponseHandlerInput.json";
import { ISPResponseSession } from '../../lambda/models/ISPResponseSession';
 
let handlerInput: HandlerInput;

let resumeResponseHandler: ResumeResponseHandler;
 
let withApiResponseMock = jest.fn(() => handlerInput.responseBuilder);
let getResponseMock = jest.fn(() => handlerInput.responseBuilder);
let withShouldEndSessionMock = jest.fn(() => handlerInput.responseBuilder);
let addDirectiveMock = jest.fn(() => handlerInput.responseBuilder);
let mockGetSessionAttributes = jest.fn();
let mockSetSessionAttributes = jest.fn();
const isRequestWithTypeMock = jest.fn();
 
handlerInput = JSON.parse(JSON.stringify(handlerInputObject)) as HandlerInput
 
beforeEach(() => {
    jest.clearAllMocks();
    
    resumeResponseHandler = new ResumeResponseHandler();
 
    UtilsHelper.prototype.isRequestWithType = isRequestWithTypeMock;
    isRequestWithTypeMock.mockReturnValue(true);

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

    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
});
 
test('ResumeResponseHandler -> canHandle -> should return true when UtilHelper.isRequestWithType returns true', () => {
    expect(
        resumeResponseHandler.canHandle(handlerInput)
    ).toBe(true);
});
 
test('ResumeResponseHandler -> canHandle -> should return false when UtilHelper.isRequestWithType returns false', () => {
    isRequestWithTypeMock.mockReturnValue(false); 

    expect(
        resumeResponseHandler.canHandle(handlerInput)
    ).toBe(false);
});
 
 
test('ResumeResponseHandler -> handle -> should set session attributes with ISP purchase result and also invoke resume event', async () => {
    await resumeResponseHandler.handle(handlerInput);
 
    expect(handlerInput.responseBuilder.addDirective).toHaveBeenCalledWith({
        target: 'AMAZON.Conversations',
        period: {
            until: 'EXPLICIT_RETURN'
        },
        updatedRequest: {
            input: {
                name: Constants.RESUME_EVENT
            },
            type: 'Dialog.InputRequest'
        },
        type: 'Dialog.DelegateRequest'
    });
    expect(mockSetSessionAttributes).toHaveBeenCalledWith({
        name: "Buy",
        purchaseResult: "ACCEPTED"
    } as ISPResponseSession);
});