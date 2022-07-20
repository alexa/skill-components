// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { interfaces, SlotValue, Response } from "ask-sdk-model";
import * as util from '../util';
import { feedbacknamespace } from '../config';
import { RatingRecorder } from '../recorders/rating-recorder';
import { LogRatingRecorder } from '../recorders/log-rating-recorder'

/* *
 * SaveRatingRequestHandler records the rating and returns the response to the skill. 
 * It can be used to handle requests to the action specified by the saveRatingAction argument to the elicitRating reusable dialog.
 * This handler will be triggered when feedback is collected: rating
 * Response contains the rating details which maps to rating type in ACDL and display for APL template
 * */
export class SaveRatingRequestHandler implements RequestHandler {
    private apiName : string;
    private ratingHandler : RatingRecorder;
    private shouldEndSession: boolean;

    constructor(
        apiName : string = `${feedbacknamespace}.defaultSaveFeedbackAction`, 
        ratingHandler : RatingRecorder | ((rating: number) => void) = new LogRatingRecorder(),
        shouldEndSession: boolean = true
    ) {
        this.apiName = apiName;
        if ("handleRating" in ratingHandler) {
            this.ratingHandler = ratingHandler 
        } else {
            this.ratingHandler = {
                "handleRating": ratingHandler
            };
        }
        this.shouldEndSession = shouldEndSession
    }

    canHandle(handlerInput : HandlerInput): boolean {
        return util.isApiRequest(handlerInput, this.apiName) 
    }

    handle(handlerInput: HandlerInput ) {
        const rating = util.getApiArguments(handlerInput).rating;
        this.ratingHandler.handleRating(rating)
        
        //response maps to rating type in ACDL
        const apiResponse =  {
            rating: rating
        };
/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
        return handlerInput.responseBuilder
            .withApiResponse(apiResponse)
            .withShouldEndSession(this.shouldEndSession)
            .getResponse();
    }
}