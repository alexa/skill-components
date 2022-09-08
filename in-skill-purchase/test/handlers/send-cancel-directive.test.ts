import { HandlerInput, ResponseBuilder } from 'ask-sdk-core';
import { services } from "ask-sdk-model";
import { mock, when, instance, deepEqual } from "ts-mockito";
import { Constants } from "../../lambda/util/Constants";
import { SendCancelDirectiveHandler } from "../../lambda/handlers/send-cancel-directive";
import { UtilsHelper } from '../../lambda/util/Helper';
import handlerInputObject from "../resources/sendCancelDirectiveHandlerInput.json";

let handlerInput: HandlerInput;
let sendCancelDirectiveHandler: SendCancelDirectiveHandler;
 
let withApiResponseMock = jest.fn(() => handlerInput.responseBuilder);
let getResponseMock = jest.fn(() => handlerInput.responseBuilder);
let withShouldEndSessionMock = jest.fn(() => handlerInput.responseBuilder);
let addDirectiveMock = jest.fn(() => handlerInput.responseBuilder);
const isApiRequestMock = jest.fn();
const getLocaleMock = jest.fn()
 
handlerInput = JSON.parse(JSON.stringify(handlerInputObject)) as HandlerInput

const locale = "en-US";

beforeEach(() => {
    jest.clearAllMocks();
    
    sendCancelDirectiveHandler = new SendCancelDirectiveHandler();

    UtilsHelper.prototype.isApiRequest = isApiRequestMock;
    UtilsHelper.prototype.getLocale = getLocaleMock;
    isApiRequestMock.mockReturnValue(true);
    getLocaleMock.mockReturnValue(locale);

    handlerInput.responseBuilder = {
        withApiResponse: withApiResponseMock,
        getResponse: getResponseMock,
        withShouldEndSession: withShouldEndSessionMock,
        addDirective: addDirectiveMock
    } as unknown as ResponseBuilder;

    handlerInput.serviceClientFactory = {
        apiConfiguration: undefined,
        getDirectiveServiceClient: undefined,
        getDeviceAddressServiceClient: undefined,
        getEndpointEnumerationServiceClient: undefined,
        getListManagementServiceClient: undefined,
        getReminderManagementServiceClient: undefined,
        getTimerManagementServiceClient: undefined,
        getUpsServiceClient: undefined,
    } as unknown as services.ServiceClientFactory
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
});
 
test('SendCancelDirectiveHandler -> canHandle -> should return true when UtilHelper.isApiRequest returns true', () => {
    expect(
        sendCancelDirectiveHandler.canHandle(handlerInput)
    ).toBe(true);
});
 
test('SendCancelDirectiveHandler -> canHandle -> should return false when UtilHelper.isApiRequest returns false', () => {
    isApiRequestMock.mockReturnValue(false);

    expect(
        sendCancelDirectiveHandler.canHandle(handlerInput)
    ).toBe(false);
});

test('SendCancelDirectiveHandler -> handle -> should send the Cancel Connections.SendRequest to ISP', async () => {
    await sendCancelDirectiveHandler.handle(handlerInput);

    expect(handlerInput.responseBuilder.addDirective)
        .toHaveBeenCalledWith(
            {
                type: Constants.SEND_REQUEST,  
                name: Constants.CANCEL,    
                payload: {
                    InSkillProduct: {
                        productId: "amzn1.adg.product.5fdc884c-5899-4681-9f43-5f597ef0bc32",
                    },
                },
                token: "correlationToken"  
            }
        );
});