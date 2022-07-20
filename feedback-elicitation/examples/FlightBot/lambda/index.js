/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const util = require('./util');
const flightSearch = require('./flightSearch')
const feedbackElicitation = require('@alexa-skill-components/feedback-elicitation')

/* *
 * FlightFinderHandler searches for the flight for given departure and arrival city and returns the response to the skill. 
 * This handler will be triggered when three slots are collected: arrivalCity, departureCity and date
 * Response contains the json which maps FlightDetails type in ACDL and display for APL template
 * */
const FlightFinderHandler = {
    canHandle(handlerInput) {
        return util.isApiRequest(handlerInput, 'com.flightsearch.FlightFinder'); //this needs to be your namespace and api name
    },
    handle(handlerInput) {
        console.log(`flight finder handler: ~~~ ${JSON.stringify(handlerInput)}`);
       
        const departure = util.getApiSlotBestValue(handlerInput, "departureCity"); //name of the U.S. city given in the api for departureCity slot (API definition)
        const arrival = util.getApiSlotBestValue(handlerInput, "arrivalCity"); //name of the U.S. city given in the api for arrivalCity slot (API definition)
        const date = util.getApiSlotBestValue(handlerInput, "date"); //date in the api for date slot (API definition)
        const flightData = flightSearch.getFlightData(departure, arrival);
        const headerTitle = "Flight Search";
        const textAlignment = "start";
        let response = "";
        let primaryText = "";
        let secondaryText = "";
        let titleText = "";
        
        // requested flight is not found, set only primary text for the visual display
        if (flightData.cost == "") { 
            primaryText = `Sorry, I couldn't find any flights from ${util.capitalizeFirstLetter(departure)} to ${util.capitalizeFirstLetter(arrival)}.`;
        }
        
        else {
            primaryText = flightData.airline;
            secondaryText = `<b>Passengers: </b>1 Adult<br><b>Seat: </b> Main Cabin<br><b>Departure Time: </b> ${flightData.departureTime} <br><b>Arrival Time: </b> ${flightData.arrivalTime} <br> <b>Total Cost: </b>$${flightData.cost}`;
            titleText = `${flightData.departureAirport} to ${flightData.arrivalAirport}`;
        }

        // response maps to FlightDetails type in ACDL
        // arrivalCity, departureCity, date, time, cost and airline
        // display is used in APL template
        response = {
            arrivalCity: arrival, 
            departureCity: departure, 
            date: date, 
            time: flightData.time,
            cost: flightData.cost,
            airline: flightData.airline,
            display: {
                headerTitle: headerTitle,
                headerSubtitle: "",
                primaryText: primaryText,
                secondaryText: secondaryText,
                textAlignment: textAlignment,
                titleText: titleText

                }
        };
        console.log("response: ", response);

        return handlerInput.responseBuilder
        .withApiResponse(response)
        .withShouldEndSession(false) // Setting this to false keeps the mic on after Alexa responds
        .getResponse();

    }
};

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);

        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        FlightFinderHandler,
        SessionEndedRequestHandler,
        new feedbackElicitation.SaveRatingRequestHandler()
      )
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();