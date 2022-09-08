import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { interfaces, Response } from 'ask-sdk-model';
import { Constants } from "../util/Constants";
import { UtilsHelper } from "../util/Helper";
import { MonetizationServiceClientException } from '../exception/MonetizationServiceClientException';

import APIInvocationRequest = interfaces.conversations.APIInvocationRequest;

export class SendUpsellDirectiveHandler implements RequestHandler {
    private utilsHelper: UtilsHelper;

    constructor() {
        this.utilsHelper = new UtilsHelper();
    }

    canHandle(handlerInput: HandlerInput): boolean {
        return this.utilsHelper.isApiRequest(handlerInput, Constants.SEND_UPSELL_DIRECTIVE_API);
    }

   async handle(handlerInput: HandlerInput): Promise<Response> {
        console.log('Calling Handler for {}', Constants.SEND_UPSELL_DIRECTIVE_API);
        const apiInvocationRequest = handlerInput.requestEnvelope.request as APIInvocationRequest;
        const upsellMessage = apiInvocationRequest.apiRequest?.arguments?.upsellMessage;
        const productName = apiInvocationRequest.apiRequest?.arguments?.productName;
        const locale = this.utilsHelper.getLocale(handlerInput);
        const serviceClientFactory = handlerInput.serviceClientFactory;
        if (serviceClientFactory) {
            return serviceClientFactory.getMonetizationServiceClient()
                .getInSkillProducts(locale)
                .then((result) => {
                    const product = result.inSkillProducts.find(product => {
                        return product.name.toLowerCase() == productName.toLowerCase();
                    })

                    return handlerInput.responseBuilder
                        .withApiResponse({})
                        .addDirective({
                            type: Constants.SEND_REQUEST,
                            name: Constants.UPSELL,
                            payload: {
                                InSkillProduct: {
                                    productId: product?.productId,
                                },
                                upsellMessage: upsellMessage, 
                            },
                            token: "correlationToken",
                        })
                        .withShouldEndSession(true)
                        .getResponse();
                }) 
                .catch((error) => {
                    throw new MonetizationServiceClientException('Failed in getting in skill product list, error:' + error);
                }); 
        }
        else {
            throw new MonetizationServiceClientException("There is no valid monetizationClient. Please add default api client in SkillBuilder.");
        }  
    }
}