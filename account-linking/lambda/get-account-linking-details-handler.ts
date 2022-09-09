import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { Constants } from "./constants";
import { UtilityHelper } from './utilities';

/**
 * Get Account Linking Details API handler
 * Responsible for handling isAccountLinked Skill API which shall validate 
 * the presence of access token in the incoming alexa request and responds accordingly
 */
export class GetAccountLinkingDetailsHandler implements RequestHandler {

    canHandle(handlerInput: HandlerInput): boolean {
        return new UtilityHelper().isApiRequest(handlerInput, Constants.IS_ACCOUNT_LINKED_API);
    }

    async handle(handlerInput: HandlerInput): Promise<Response> {
        console.log('Calling Handler for {}', Constants.IS_ACCOUNT_LINKED_API);

        // If access token is present and valid, api response shall return `accountLinkedStatus` as linked.
        if (handlerInput.requestEnvelope.context.System.user.accessToken !== undefined 
            && handlerInput.requestEnvelope.context.System.user.accessToken !== null 
            && handlerInput.requestEnvelope.context.System.user.accessToken !== '') {
            return handlerInput.responseBuilder
                .withApiResponse({accountLinkedStatus: Constants.LINKED_STATUS})
                .withShouldEndSession(false)
                .getResponse();
        }

        // Since access token is not present/invalid in the alexa request,
        // api response shall return `accountLinkedStatus` as unlinked and
        // also send account linking card to the user device to linked their account.
        return handlerInput.responseBuilder
            .withApiResponse({accountLinkedStatus: Constants.UNLINKED_STATUS})
            .withLinkAccountCard()
            .withShouldEndSession(true)
            .getResponse();

    }
}
