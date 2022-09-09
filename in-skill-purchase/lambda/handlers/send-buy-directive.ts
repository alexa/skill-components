import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response, interfaces } from 'ask-sdk-model';
import { Constants } from "../util/Constants";
import { UtilsHelper } from "../util/Helper";
import APIInvocationRequest = interfaces.conversations.APIInvocationRequest;

/**
 * Send buy directive API Call
 */
export class SendBuyDirectiveHandler implements RequestHandler {
    private utilsHelper: UtilsHelper;

    constructor() {
        this.utilsHelper = new UtilsHelper();
    }

    canHandle(handlerInput: HandlerInput): boolean {
        return this.utilsHelper.isApiRequest(handlerInput, Constants.SEND_BUY_DIRECTIVE_API)
    }

   async handle(handlerInput: HandlerInput): Promise<Response> {
        console.log('Calling Handler for {}', Constants.SEND_BUY_DIRECTIVE_API);

        const apiInvocationRequest = handlerInput.requestEnvelope.request as APIInvocationRequest;
        const productId = apiInvocationRequest.apiRequest?.arguments?.productId;

        return handlerInput.responseBuilder
                .withApiResponse({})
                .addDirective({
                    type: Constants.SEND_REQUEST,  
                    name: Constants.BUY,    
                    payload: {       
                        InSkillProduct: {
                            productId: productId
                        }
                    },
                    token: "correlationToken"  
                })
                .withShouldEndSession(true)
                .getResponse();
    }
}