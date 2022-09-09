import { HandlerInput, ResponseBuilder } from 'ask-sdk-core';
import { services } from "ask-sdk-model";
import { mock, when, instance, deepEqual } from "ts-mockito";
import { Constants } from "../../lambda/util/Constants";
import { SendBuyDirectiveHandler } from "../../lambda/handlers/send-buy-directive";
import { UtilsHelper } from '../../lambda/util/Helper';
import handlerInputObject from "../resources/sendBuyDirectiveHandlerInput.json";
 
let handlerInput: HandlerInput;
let sendBuyDirectiveHandler: SendBuyDirectiveHandler;
let monetizationServiceClient: services.monetization.MonetizationServiceClient;
 
let withApiResponseMock = jest.fn(() => handlerInput.responseBuilder);
let getResponseMock = jest.fn(() => handlerInput.responseBuilder);
let withShouldEndSessionMock = jest.fn(() => handlerInput.responseBuilder);
let addDirectiveMock = jest.fn(() => handlerInput.responseBuilder);
const isApiRequestMock = jest.fn();
 
handlerInput = JSON.parse(JSON.stringify(handlerInputObject)) as HandlerInput
 
beforeEach(() => {
    jest.clearAllMocks();
     
    sendBuyDirectiveHandler = new SendBuyDirectiveHandler();
 
    UtilsHelper.prototype.isApiRequest = isApiRequestMock;
    isApiRequestMock.mockReturnValue(true); 

    handlerInput.responseBuilder = {
        withApiResponse: withApiResponseMock,
        getResponse: getResponseMock,
        withShouldEndSession: withShouldEndSessionMock,
        addDirective: addDirectiveMock
    } as unknown as ResponseBuilder;
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
});
 
test('SendBuyDirectiveHandler -> canHandle -> should return true when UtilHelper.isApiRequest returns true', () => {
    expect(
        sendBuyDirectiveHandler.canHandle(handlerInput)
    ).toBe(true);
});
 
test('SendBuyDirectiveHandler -> canHandle -> should return false when UtilHelper.isApiRequest returns false', () => {
    isApiRequestMock.mockReturnValue(false); 
 
    expect(
        sendBuyDirectiveHandler.canHandle(handlerInput)
    ).toBe(false);
});
 
 
test('SendBuyDirectiveHandler -> handle -> should send the Buy Connections.SendRequest to ISP', async () => {
    await sendBuyDirectiveHandler.handle(handlerInput);
 
    expect(handlerInput.responseBuilder.addDirective)
        .toHaveBeenCalledWith(
            {
                type: "Connections.SendRequest",  
                name: "Buy",    
                payload: {       
                    InSkillProduct: {
                        productId: "amzn1.adg.product.679b0753-8b8f-4b47-8ce3-c43b250a0a3f"
                    }
                },
                token: "correlationToken"  
            }
        );
});