// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { getRequestType, HandlerInput, RequestHandler, SkillBuilders} from 'ask-sdk-core';
import { interfaces, SlotValue } from "ask-sdk-model";
import APIInvocationRequest = interfaces.conversations.APIInvocationRequest;
import * as util from './util';
import  {getWeather} from './WeatherClient';
import { SaveRatingRequestHandler } from '@alexa-skill-components/feedback-elicitation';

// Request handler is the code responsible for taking action on one or more types of incoming requests
// Get weather API request handler is for taking action to get the weather for location and date
// The HandlerInput.responseBuilder method returns a ResponseBuilder object
const GetWeatherApiHandler : RequestHandler= {
    canHandle(handlerInput) {
        return util.isApiRequest(handlerInput, 'examples.weatherbot.getWeather');
    },
    handle(handlerInput) {
        const cityName  = util.getApiArguments(handlerInput).cityName;
        const date  = util.getApiArguments(handlerInput).date;
        
        console.log(`City name is ${cityName} and date is ${date}`);

        if (!cityName || !date) {
            // We couldn't find the city name or date in the request, so we'll return 
            // empty, so that model can render a fallback prompt to the user.
            return { apiResponse: {} };
        }

        // Call a service to get the weather for this location and date.
        const weather = getWeather(cityName, date);

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


// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
export const handler = SkillBuilders.custom()
    .addRequestHandlers(
        GetWeatherApiHandler,
        new SaveRatingRequestHandler()
    )
    .addRequestInterceptors(util.RequestInterceptor)
    .addResponseInterceptors(util.ResponseInterceptor)
    .lambda();