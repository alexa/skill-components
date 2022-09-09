import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { interfaces, Response } from 'ask-sdk-model';
import { Constants } from "../util/Constants";
import { UtilsHelper } from "../util/Helper";

import APIInvocationRequest = interfaces.conversations.APIInvocationRequest;
/**
 * Send Cancel Directive Call
 * Receives productID as input
 */
export class SendCancelDirectiveHandler implements RequestHandler {
    private utilsHelper: UtilsHelper;

    constructor() {
        this.utilsHelper = new UtilsHelper();
    }

    canHandle(handlerInput: HandlerInput): boolean {
        return this.utilsHelper.isApiRequest(handlerInput, Constants.SEND_CANCEL_DIRECTIVE_API);
    }

   async handle(handlerInput: HandlerInput): Promise<Response> {
        console.log('Calling Handler for {}', Constants.SEND_CANCEL_DIRECTIVE_API);

        const apiInvocationRequest = handlerInput.requestEnvelope.request as APIInvocationRequest;
        const productId = apiInvocationRequest.apiRequest?.arguments?.productId;

        return handlerInput.responseBuilder
            .withApiResponse({})
            .addDirective({
                type: "Connections.SendRequest",
                name: "Cancel",
                payload: {
                    InSkillProduct: {
                        productId: productId,
                    },
                },
                token: "correlationToken",
            })
            .withShouldEndSession(true)
            .getResponse();
    }
}