import { getRequestType, HandlerInput } from 'ask-sdk-core';
import { interfaces } from "ask-sdk-model";
import APIInvocationRequest = interfaces.conversations.APIInvocationRequest;

/**
 * This is a RequestUtils class.
 */
export class UtilsHelper {

    /**
     * Check if the request type is [Dialog.API.Invoked] and its name is same as given api name.
     */
    isApiRequest(handlerInput: HandlerInput, apiName: string): boolean {
        if (getRequestType(handlerInput.requestEnvelope) !== 'Dialog.API.Invoked') {
            return false;
        }

        const apiRequestName = (handlerInput.requestEnvelope.request as APIInvocationRequest).apiRequest?.name;
        return apiRequestName === apiName;
    }

    /**
     * Check if a request matches the given type.
     */
     isRequestWithType(handlerInput: HandlerInput, requestType: string): boolean {
        return getRequestType(handlerInput.requestEnvelope) === requestType;
    }

     /**
     * Returns locale from @see {HandlerInput}.
     */
      getLocale(handlerInput: HandlerInput): string {
        const locale = handlerInput.requestEnvelope.request.locale;
        if (locale) {
            return locale;   
        } else {
            throw new Error('Missing locale.');
        }
    }
}