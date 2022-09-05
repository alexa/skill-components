import { getRequestType, HandlerInput } from 'ask-sdk-core';
import { interfaces } from "ask-sdk-model";
import { Constants } from "./constants";
import APIInvocationRequest = interfaces.conversations.APIInvocationRequest;

/*
 * Helper Utilities for the Account Linking Skill Handlers
 */
export class UtilityHelper {
    /**
     * Check if the request type is [Dialog.API.Invoked] and the name in the request matches the handler type
     */
    isApiRequest(handlerInput: HandlerInput, apiName: string): boolean {
        if (getRequestType(handlerInput.requestEnvelope) !== Constants.DIALOG_API_REQUEST) {
            return false;
        }

        return (handlerInput.requestEnvelope.request as APIInvocationRequest).apiRequest?.name === apiName;
    }
}
