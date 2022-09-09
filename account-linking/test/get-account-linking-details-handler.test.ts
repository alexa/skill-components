import { HandlerInput, ResponseBuilder } from 'ask-sdk-core';
import { User } from "ask-sdk-model";
import { Constants } from "../lambda/constants";
import { GetAccountLinkingDetailsHandler } from "../lambda/get-account-linking-details-handler";
import { UtilityHelper } from '../lambda/utilities';
import handlerInputObject from "./resources/getAccountLinkingStatusHandlerInput.json";

let handlerInput: HandlerInput;
let getAccountLinkingDetailsHandler: GetAccountLinkingDetailsHandler;
handlerInput = JSON.parse(JSON.stringify(handlerInputObject)) as HandlerInput

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});

    getAccountLinkingDetailsHandler = new GetAccountLinkingDetailsHandler();
    handlerInput.responseBuilder = {
        withApiResponse: jest.fn(() => handlerInput.responseBuilder),
        getResponse: jest.fn(() => handlerInput.responseBuilder),
        withShouldEndSession: jest.fn(() => handlerInput.responseBuilder),
        withLinkAccountCard: jest.fn(() => handlerInput.responseBuilder)
    } as unknown as ResponseBuilder;
});

test('GetAccountLinkingDetailsHandler -> canHandle -> should return false when UtilityHelper.isApiRequest returns false', () => {
    const isApiRequestMock = jest.fn();
    UtilityHelper.prototype.isApiRequest = isApiRequestMock;
    isApiRequestMock.mockReturnValue(false);

    expect(
        getAccountLinkingDetailsHandler.canHandle(handlerInput)
    ).toBe(false);
});

test('GetAccountLinkingDetailsHandler -> canHandle -> should return true when UtilityHelper.isApiRequest returns true', () => {
    const isApiRequestMock = jest.fn();
    UtilityHelper.prototype.isApiRequest = isApiRequestMock;
    isApiRequestMock.mockReturnValue(true);

    expect(
        getAccountLinkingDetailsHandler.canHandle(handlerInput)
    ).toBe(true);
});

test('GetAccountLinkingDetailsHandler -> handle -> should return correct api response when access token is present', async () => {

    handlerInput.requestEnvelope.context.System.user = {
        'accessToken': "fake-value",
        'userId': 'fake-user-id'
    } as User

    await getAccountLinkingDetailsHandler.handle(handlerInput);

    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            { 
                accountLinkedStatus: Constants.LINKED_STATUS
            }
        );
    expect(handlerInput.responseBuilder.withShouldEndSession).toHaveBeenCalledWith(false);
});

test('GetAccountLinkingDetailsHandler -> handle -> should return correct api response when access token is absent along with account linking card', async () => {
    handlerInput.requestEnvelope.context.System.user = {
        'accessToken': undefined,
        'userId': 'fake-user-id'
    } as User

    await getAccountLinkingDetailsHandler.handle(handlerInput);

    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            { 
                accountLinkedStatus: Constants.UNLINKED_STATUS
            }
        );
    expect(handlerInput.responseBuilder.withShouldEndSession).toHaveBeenCalledWith(true);
    expect(handlerInput.responseBuilder.withLinkAccountCard).toHaveBeenCalledWith();
});

test('GetAccountLinkingDetailsHandler -> handle -> should return correct api response when access token is null along with account linking card', async () => {
    handlerInput.requestEnvelope.context.System.user = {
        'accessToken': null,
        'userId': 'fake-user-id'
    } as unknown as User

    await getAccountLinkingDetailsHandler.handle(handlerInput);

    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            { 
                accountLinkedStatus: Constants.UNLINKED_STATUS
            }
        );
    expect(handlerInput.responseBuilder.withShouldEndSession).toHaveBeenCalledWith(true);
    expect(handlerInput.responseBuilder.withLinkAccountCard).toHaveBeenCalledWith();
});

test('GetAccountLinkingDetailsHandler -> handle -> should return correct api response when access token is empty along with account linking card', async () => {
    handlerInput.requestEnvelope.context.System.user = {
        'accessToken': '',
        'userId': 'fake-user-id'
    } as User

    await getAccountLinkingDetailsHandler.handle(handlerInput);

    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            { 
                accountLinkedStatus: Constants.UNLINKED_STATUS
            }
        );
    expect(handlerInput.responseBuilder.withShouldEndSession).toHaveBeenCalledWith(true);
    expect(handlerInput.responseBuilder.withLinkAccountCard).toHaveBeenCalledWith();
});
