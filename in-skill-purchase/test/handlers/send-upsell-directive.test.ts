import { HandlerInput, ResponseBuilder } from 'ask-sdk-core';
import { services } from "ask-sdk-model";
import { mock, when, instance, deepEqual } from "ts-mockito";
import { Constants } from "../../lambda/util/Constants";
import { SendUpsellDirectiveHandler } from "../../lambda/handlers/send-upsell-directive";

import { UtilsHelper } from '../../lambda/util/Helper';
import handlerInputObject from "../resources/sendUpsellDirectiveHandlerInput.json";
import { MonetizationServiceClientException } from '../../lambda/exception/MonetizationServiceClientException';

let handlerInput: HandlerInput;
let sendUpsellDirectiveHandler: SendUpsellDirectiveHandler;
let monetizationServiceClient: services.monetization.MonetizationServiceClient;
 
let withApiResponseMock = jest.fn(() => handlerInput.responseBuilder);
let getResponseMock = jest.fn(() => handlerInput.responseBuilder);
let withShouldEndSessionMock = jest.fn(() => handlerInput.responseBuilder);
let addDirectiveMock = jest.fn(() => handlerInput.responseBuilder);
const isApiRequestMock = jest.fn();
const getLocaleMock = jest.fn();
 
handlerInput = JSON.parse(JSON.stringify(handlerInputObject)) as HandlerInput

const locale = "en-US";

beforeEach(() => {
    jest.clearAllMocks();
    
    monetizationServiceClient = mock(services.monetization.MonetizationServiceClient);

    sendUpsellDirectiveHandler = new SendUpsellDirectiveHandler();

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
        getMonetizationServiceClient: () => instance(monetizationServiceClient),
        getReminderManagementServiceClient: undefined,
        getTimerManagementServiceClient: undefined,
        getUpsServiceClient: undefined,
    } as unknown as services.ServiceClientFactory
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
});
 
test('SendUpsellDirectiveHandler -> canHandle -> should return true when UtilHelper.isApiRequest returns true', () => {
    expect(
        sendUpsellDirectiveHandler.canHandle(handlerInput)
    ).toBe(true);
});
 
test('SendUpsellDirectiveHandler -> canHandle -> should return false when UtilHelper.isApiRequest returns false', () => {
    isApiRequestMock.mockReturnValue(false);

    expect(
        sendUpsellDirectiveHandler.canHandle(handlerInput)
    ).toBe(false);
});


test('SendUpsellDirectiveHandler -> handle -> should throw error if monetizationServiceClient.getInSkillProducts fails', async () => {
    when(monetizationServiceClient.getInSkillProducts(locale))
        .thenThrow(new MonetizationServiceClientException("Unknown Error!"))

    expect(async () => {
        await sendUpsellDirectiveHandler.handle(handlerInput)
    }).rejects.toThrow(MonetizationServiceClientException);
});
 
test('SendUpsellDirectiveHandler -> handle -> should throw error if no monetizationServiceClient', async () => {
    handlerInput.serviceClientFactory = undefined;

    expect(async () => {
        await sendUpsellDirectiveHandler.handle(handlerInput)
    }).rejects.toThrow(MonetizationServiceClientException);
});

test('SendUpsellDirectiveHandler -> handle -> should throw error if missing locale', async () => {
    getLocaleMock.mockReturnValue(new Error("Missing locale."));

    expect(async () => {
        await sendUpsellDirectiveHandler.handle(handlerInput)
    }).rejects.toThrow(Error);
});

test('SendUpsellDirectiveHandler -> handle -> should send the Buy Connections.SendRequest to ISP', async () => {
    when(monetizationServiceClient.getInSkillProducts(locale)).thenResolve(
        {
            "inSkillProducts": [
                {
                    "productId": "amzn1.adg.product.9d30f07f-758e-41e2-abbf-fa9be0d16256",
                    "referenceName": "ValueSubscription",
                    "type": "SUBSCRIPTION",
                    "name": "Value subscription",
                    "summary": "you can access 45+ mindfull sessions",
                    "entitled": "ENTITLED",
                    "purchasable": "PURCHASABLE",
                    "activeEntitlementCount": 0,
                    "purchaseMode": "TEST"
                },
            ]
        } as services.monetization.InSkillProductsResponse
    );

    await sendUpsellDirectiveHandler.handle(handlerInput);

    expect(handlerInput.responseBuilder.addDirective)
        .toHaveBeenCalledWith(
            {
                type: "Connections.SendRequest",  
                name: "Upsell",    
                payload: {
                    InSkillProduct: {
                        productId: "amzn1.adg.product.9d30f07f-758e-41e2-abbf-fa9be0d16256",
                    },
                    upsellMessage: "Upsell message three", 
                },
                token: "correlationToken"  
            }
        );
});