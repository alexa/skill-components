import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import {DelegateRequestDirectiveBuilder, UpdatedInputRequestBuilder} from "./DelegateRequestDirectiveBuilder";

/**
 * Helper for the management of skill experience delegation
 */
export class DelegateHelper {

    /**
     * Delegate management back to Alexa Conversation.
     */
    proceedToAlexaConversationsEvent(handlerInput: HandlerInput, eventName: string): Response {
        return handlerInput.responseBuilder
            .addDirective(new DelegateRequestDirectiveBuilder()
                .withTarget(DelegateRequestDirectiveBuilder.ALEXA_CONVERSATIONS_TARGET)
                .withUpdateRequest(new UpdatedInputRequestBuilder().withInputName(eventName).build())
                .build()
            )
            .getResponse();
    }
}
