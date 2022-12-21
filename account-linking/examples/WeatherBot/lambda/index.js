const Alexa = require('ask-sdk-core');
const util = require('./util');
const weatherClient = require('./WeatherClient');
const accountLinking = require('@alexa-skill-components/account-linking');

const GetWeatherApiHandler = {
    canHandle(handlerInput) {
        return util.isApiRequest(handlerInput, 'com.weatherbot.getWeather');
    },
    handle(handlerInput) {
        const cityName = util.getApiArguments(handlerInput).cityName;
        const date = util.getApiArguments(handlerInput).date;
        
        console.log(`City name is ${cityName} and date is ${date}`);

        if (!cityName || !date) {
            // We couldn't find the city name or date in the request, so we'll return 
            // empty, so that model can render a fallback prompt to the user.
            return { apiResponse: {} };
        }

        // Call a service to get the weather for this location and date.
        const weather = weatherClient.getWeather(cityName, date);

        const apiResponse =  {
            cityName: cityName,
            lowTemp: weather['lowTemperature'],
            highTemp: weather['highTemperature']
        };

        return handlerInput.responseBuilder
            .withApiResponse(apiResponse)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome, you can say Hello or Help. Which would you like to try?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
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

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        new accountLinking.GetAccountLinkingDetailsHandler(),
        GetWeatherApiHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();