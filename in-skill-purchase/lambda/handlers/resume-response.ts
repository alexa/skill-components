import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response, interfaces } from 'ask-sdk-model';
import { Constants } from "../util/Constants";
import { UtilsHelper } from "../util/Helper";
import ConnectionsResponse = interfaces.connections.ConnectionsResponse;
import { ISPResponseSession } from '../models/ISPResponseSession';
import { DelegateHelper } from '../util/DelegateHelper';


export class ResumeResponseHandler implements RequestHandler {
    private utilsHelper: UtilsHelper;

    constructor() {
        this.utilsHelper = new UtilsHelper();
    }

    canHandle(handlerInput: HandlerInput): boolean {
        return this.utilsHelper.isRequestWithType(handlerInput, Constants.ISP_CONNECTIONS_RESPONSE)
    }

    async handle(handlerInput: HandlerInput): Promise<Response> {
        console.log('Calling Handler for {}', Constants.RESUME_RESPONSE);

        const connectionsResponseRequest = handlerInput.requestEnvelope.request as ConnectionsResponse;
        const payload = connectionsResponseRequest.payload;
        const name = connectionsResponseRequest.name;

        const sessionAttributes = {
            name: name,
            purchaseResult: payload?.purchaseResult
        } as ISPResponseSession;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        return new DelegateHelper().proceedToAlexaConversationsEvent(handlerInput, Constants.RESUME_EVENT);
    }
}