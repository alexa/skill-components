import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { ISPResponseSession } from '../models/ISPResponseSession';
import { Constants } from "../util/Constants";
import { UtilsHelper } from "../util/Helper";

/**
 * Get purchase result API Call
 */
export class GetPurchaseResultHandler implements RequestHandler {
    private utilsHelper: UtilsHelper;

    constructor() {
        this.utilsHelper = new UtilsHelper();
    }

    canHandle(handlerInput: HandlerInput): boolean {
        return this.utilsHelper.isApiRequest(handlerInput, Constants.GET_PURCHASE_RESULT);
    }

    async handle(handlerInput: HandlerInput): Promise<Response> {
        console.log('Calling Handler for {}', Constants.GET_PURCHASE_RESULT);

        const ISPResponseSessionAttributes = handlerInput.attributesManager.getSessionAttributes() as ISPResponseSession;
       
        return handlerInput.responseBuilder
            .withApiResponse({ 
                name: ISPResponseSessionAttributes.name,
                status: ISPResponseSessionAttributes.purchaseResult
            })
            .withShouldEndSession(false)
            .getResponse();
    }
}