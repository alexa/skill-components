import { HandlerInput, ResponseBuilder } from 'ask-sdk-core';
import { services } from "ask-sdk-model";
import { mock, when, instance, deepEqual } from "ts-mockito";
import { Constants } from "../../lambda/util/Constants";
import { GetProductIdHandler } from "../../lambda/handlers/get-product-id";
import { UtilsHelper } from '../../lambda/util/Helper';
import handlerInputObject from "../resources/getProductIdHandlerInput.json";
import { MonetizationServiceClientException } from '../../lambda/exception/MonetizationServiceClientException';
 
let handlerInput: HandlerInput;
let getProductIdHandler: GetProductIdHandler;
let monetizationServiceClient: services.monetization.MonetizationServiceClient;
 
let withApiResponseMock = jest.fn(() => handlerInput.responseBuilder);
let getResponseMock = jest.fn(() => handlerInput.responseBuilder);
let withShouldEndSessionMock = jest.fn(() => handlerInput.responseBuilder);
const isApiRequestMock = jest.fn();
const getLocaleMock = jest.fn();
 
handlerInput = JSON.parse(JSON.stringify(handlerInputObject)) as HandlerInput;

const locale = "en-US";
 
beforeEach(() => {
    jest.clearAllMocks();
    
    monetizationServiceClient = mock(services.monetization.MonetizationServiceClient);

    getProductIdHandler = new GetProductIdHandler();

    UtilsHelper.prototype.isApiRequest = isApiRequestMock;
    UtilsHelper.prototype.getLocale = getLocaleMock;
    isApiRequestMock.mockReturnValue(true);
    getLocaleMock.mockReturnValue(locale);

    handlerInput.responseBuilder = {
        withApiResponse: withApiResponseMock,
        getResponse: getResponseMock,
        withShouldEndSession: withShouldEndSessionMock,
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
 
test('GetProductIdHandler -> canHandle -> should return true when UtilHelper.isApiRequest returns true', () => {
    expect(
        getProductIdHandler.canHandle(handlerInput)
    ).toBe(true);
});
 
test('GetProductIdHandler -> canHandle -> should return false when UtilHelper.isApiRequest returns false', () => {
    isApiRequestMock.mockReturnValue(false);
 
    expect(
        getProductIdHandler.canHandle(handlerInput)
    ).toBe(false);
});
 
 
test('GetProductIdHandler -> handle -> should return purchasable true and productId if product is in inSkillProductList', async () => {
    when(monetizationServiceClient.getInSkillProducts(locale)).thenResolve(
        {
            "inSkillProducts": [
                {
                    "productId": "amzn1.adg.product.unique-id-1",
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
 
    await getProductIdHandler.handle(handlerInput);
 
    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            { 
                purchasable: "true",
                productId: "amzn1.adg.product.unique-id-1"
            }
        );
});

test('GetProductIdHandler -> handle -> should return purchasable false if product is not in inSkillProductLis', async () => {
    when(monetizationServiceClient.getInSkillProducts(locale)).thenResolve(
        {
            "inSkillProducts": [
                {
                    "productId": "amzn1.adg.product.unique-id-1",
                    "referenceName": "EliteSubscription",
                    "type": "SUBSCRIPTION",
                    "name": "Elite subscription",
                    "summary": "you can access 45+ mindfull sessions",
                    "entitled": "ENTITLED",
                    "purchasable": "PURCHASABLE",
                    "activeEntitlementCount": 0,
                    "purchaseMode": "TEST"
                },
            ]
        } as services.monetization.InSkillProductsResponse
    );
 
    await getProductIdHandler.handle(handlerInput);
 
    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            { 
                purchasable: "false",
                productId: undefined
            }
        );
});
 
test('GetProductIdHandler -> handle -> should throw error if monetizationServiceClient.getInSkillProducts fails', async () => {
    when(monetizationServiceClient.getInSkillProducts(locale))
        .thenThrow(new MonetizationServiceClientException("Unknown Error!"))
 
    expect(async () => {
        await getProductIdHandler.handle(handlerInput)
    }).rejects.toThrow(MonetizationServiceClientException);
});
 
test('GetProductIdHandler -> handle -> should throw error if no monetizationServiceClient', async () => {
    handlerInput.serviceClientFactory = undefined;
 
    expect(async () => {
        await getProductIdHandler.handle(handlerInput)
    }).rejects.toThrow(MonetizationServiceClientException);
});

test('GetProductIdHandler -> handle -> should throw error if missing locale', async () => {
    getLocaleMock.mockReturnValue(new Error("Missing locale."));

    expect(async () => {
        await getProductIdHandler.handle(handlerInput)
    }).rejects.toThrow(Error);
});