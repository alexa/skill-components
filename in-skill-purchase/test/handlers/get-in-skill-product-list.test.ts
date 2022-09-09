import { HandlerInput, ResponseBuilder } from 'ask-sdk-core';
import { services } from "ask-sdk-model";
import { mock, when, instance, deepEqual } from "ts-mockito";
import { Constants } from "../../lambda/util/Constants";
import { GetInSkillProductListHandler } from "../../lambda/handlers/get-in-skill-product-list";
import { UtilsHelper } from '../../lambda/util/Helper';
import handlerInputObject from "../resources/getInSkillProductListHandlerInput.json";
import { MonetizationServiceClientException } from '../../lambda/exception/MonetizationServiceClientException';

let handlerInput: HandlerInput;
let getInSkillProductListHandler: GetInSkillProductListHandler;
let monetizationServiceClient: services.monetization.MonetizationServiceClient;

let withApiResponseMock = jest.fn(() => handlerInput.responseBuilder);
let getResponseMock = jest.fn(() => handlerInput.responseBuilder);
let withShouldEndSessionMock = jest.fn(() => handlerInput.responseBuilder);
const isApiRequestMock = jest.fn();
const getLocaleMock = jest.fn();

handlerInput = JSON.parse(JSON.stringify(handlerInputObject)) as HandlerInput

const locale = "en-US";

beforeEach(() => {
    jest.clearAllMocks();
    
    monetizationServiceClient = mock(services.monetization.MonetizationServiceClient);

    getInSkillProductListHandler = new GetInSkillProductListHandler();

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

test('GetInSkillProductListHandler -> canHandle -> should return true when UtilHelper.isApiRequest returns true', () => {
    expect(
        getInSkillProductListHandler.canHandle(handlerInput)
    ).toBe(true);
});

test('GetInSkillProductListHandler -> canHandle -> should return false when UtilHelper.isApiRequest returns false', () => {
    isApiRequestMock.mockReturnValue(false);

    expect(
        getInSkillProductListHandler.canHandle(handlerInput)
    ).toBe(false);
});


test('GetInSkillProductListHandler -> handle -> should return correct purchasable subscription products list', async () => {
    when(monetizationServiceClient.getInSkillProducts(locale, Constants.PURCHASABLE, Constants.NOT_ENTITLED, Constants.SUBSCRIPTION, undefined, undefined)).thenResolve(
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

    await getInSkillProductListHandler.handle(handlerInput);

    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            { 
                inSkillProductList: [
                    {
                        "productId": "amzn1.adg.product.unique-id-1",
                        "productName": "Value subscription",
                        "productSummary": "you can access 45+ mindfull sessions",
                    }
                ]
            }
        );
});

test('GetInSkillProductListHandler -> handle -> should throw error if monetizationServiceClient.getInSkillProducts fails', async () => {
    when(monetizationServiceClient.getInSkillProducts("en-US", Constants.PURCHASABLE, Constants.NOT_ENTITLED, Constants.SUBSCRIPTION, undefined, undefined))
        .thenThrow(new MonetizationServiceClientException("Unknown Error!"))

    expect(async () => {
        await getInSkillProductListHandler.handle(handlerInput)
    }).rejects.toThrow(MonetizationServiceClientException);
});

test('GetInSkillProductListHandler -> handle -> should throw error if no monetizationServiceClient', async () => {
    handlerInput.serviceClientFactory = undefined;

    expect(async () => {
        await getInSkillProductListHandler.handle(handlerInput)
    }).rejects.toThrow(MonetizationServiceClientException);
});

test('GetInSkillProductListHandler -> handle -> should throw error if missing locale', async () => {
    getLocaleMock.mockReturnValue(new Error("Missing locale."));

    expect(async () => {
        await getInSkillProductListHandler.handle(handlerInput)
    }).rejects.toThrow(Error);
});