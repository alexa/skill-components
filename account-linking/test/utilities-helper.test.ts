import { HandlerInput, ResponseBuilder } from 'ask-sdk-core';
import { interfaces, IntentRequest } from "ask-sdk-model";
import { UtilityHelper } from '../lambda/utilities';
import { Constants } from "../lambda/constants";
import APIInvocationRequest = interfaces.conversations.APIInvocationRequest;

let handlerInput: HandlerInput;
let utilityHelper: UtilityHelper;
handlerInput = {requestEnvelope: {request: {}}} as HandlerInput

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});

    utilityHelper = new UtilityHelper();
});

test('UtilityHelper -> isApiRequest -> should return false when RequestType is not Dialog.API.Invoked', () => {
    handlerInput.requestEnvelope.request = {
        type: "IntentRequest"
    } as IntentRequest;

    expect(
        utilityHelper.isApiRequest(handlerInput, Constants.IS_ACCOUNT_LINKED_API)
    ).toBe(false);
});

test('UtilityHelper -> isApiRequest -> should return false when expected api name does not matches the handler input api name', () => {
    handlerInput.requestEnvelope.request = {
        type: Constants.DIALOG_API_REQUEST,
        apiRequest: {
            name: "Fake Value"
        } 
    } as APIInvocationRequest;

    expect(
        utilityHelper.isApiRequest(handlerInput, Constants.IS_ACCOUNT_LINKED_API)
    ).toBe(false);
});

test('UtilityHelper -> isApiRequest -> should return true when expected api name does matches the handler input api name and the request type is of Dialog.API.Invoked', () => {
    handlerInput.requestEnvelope.request = {
        type: Constants.DIALOG_API_REQUEST,
        apiRequest: {
            name: Constants.IS_ACCOUNT_LINKED_API
        } 
    } as APIInvocationRequest;

    expect(
        utilityHelper.isApiRequest(handlerInput, Constants.IS_ACCOUNT_LINKED_API)
    ).toBe(true);
});
