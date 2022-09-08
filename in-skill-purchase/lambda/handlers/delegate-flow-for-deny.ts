import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { Constants } from "../util/Constants";
import { UtilsHelper } from "../util/Helper";

/**
 * delegateFlowForDeny API request handler.
 */
export class DelegateFlowForDenyHandler implements RequestHandler {
    private utilsHelper: UtilsHelper;

    constructor() {
        this.utilsHelper = new UtilsHelper();
    }

    canHandle(handlerInput: HandlerInput): boolean {
        return this.utilsHelper.isApiRequest(handlerInput, Constants.DELEGATE_FLOW_FOR_DENY_API)
    }

   async handle(handlerInput: HandlerInput): Promise<Response> {
        console.log('Calling Handler for {}', Constants.DELEGATE_FLOW_FOR_DENY_API);
        // dummy API response
        return handlerInput.responseBuilder
            .withApiResponse({})
            .withShouldEndSession(false)
            .getResponse();
    }
}