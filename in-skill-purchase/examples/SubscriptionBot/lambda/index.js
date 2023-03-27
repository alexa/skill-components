const Alexa = require('ask-sdk-core');
const isp = require('@alexa-skill-components/in-skill-purchase')
const util =  require('./util');
const DefaultApiClient = require('ask-sdk-core').DefaultApiClient;
const RequestInterceptor = {
    process(handlerInput) {
        console.log(`FULL INPUT = ${JSON.stringify(handlerInput)}`);

        if (handlerInput.requestEnvelope) {
            console.log(`REQUEST ENVELOPE = ${JSON.stringify(handlerInput.requestEnvelope)}`);
            if (handlerInput.requestEnvelope.request) {
                console.log(`REQUEST = ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
                console.log(`REQUEST TYPE = ${Alexa.getRequestType(handlerInput.requestEnvelope)}`);
                if (util.isApiRequest(handlerInput)) {
                    console.log(`API NAME = ${util.getAPIName(handlerInput)}`);
                    console.log(`API ARGS = ${JSON.stringify(util.getApiArguments(handlerInput))}`);
                    console.log(`API SLOTS = ${JSON.stringify(util.getApiSlots(handlerInput))}`);
                    console.log(`API SLOT IDS = ${JSON.stringify(util.getResolvedApiSlotIds(handlerInput))}`);
                    console.log(`API SLOT VALUES = ${JSON.stringify(util.getResolvedApiSlotValues(handlerInput))}`);
                }
            }
        }
    }
};

const ResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`RESPONSE = ${JSON.stringify(response)}`);
    },
};
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        ...isp.in_skill_purchase.createHandlers(),
       // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .withApiClient(new DefaultApiClient())
    .addRequestInterceptors(RequestInterceptor) //Interceptors added to record logs
    .addResponseInterceptors(ResponseInterceptor)
    .lambda();