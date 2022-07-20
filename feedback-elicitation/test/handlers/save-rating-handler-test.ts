const { describe, test, expect } = require('@jest/globals');

//const {SaveRatingRequestHandler,} = require('../../lambda/handlers/standardHandlers');
import { HandlerInput, ResponseBuilder } from 'ask-sdk-core';
import { SaveRatingRequestHandler}  from '../../lambda/handlers/save-rating-handler'
import handlerInputObject from "../resources/defaultHandlerInput.json";
import handlerInputForNegativeCaseObject from "../resources/handlerInputForNegativeCase.json";
import { CustomRatingRecorder, testString } from '../recorders/custom-recorder';

let handlerInput: HandlerInput;
let handlerInputforNegativeScenario: HandlerInput;
let saveRatingRequestHandler: SaveRatingRequestHandler

let withApiResponseMock = jest.fn(() => handlerInput.responseBuilder);
let getResponseMock = jest.fn(() => handlerInput.responseBuilder);
let withShouldEndSessionMock = jest.fn(() => handlerInput.responseBuilder);
const isApiRequestMock = jest.fn();


handlerInput = JSON.parse(JSON.stringify(handlerInputObject)) as HandlerInput;
handlerInputforNegativeScenario = JSON.parse(JSON.stringify(handlerInputForNegativeCaseObject)) as HandlerInput;


describe('SaveRatingRequestHandler', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        saveRatingRequestHandler = new SaveRatingRequestHandler()

        handlerInput.responseBuilder = {
            withApiResponse: withApiResponseMock,
            getResponse: getResponseMock,
            withShouldEndSession: withShouldEndSessionMock,
        } as unknown as ResponseBuilder;
        
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});
    })



    test('saveRatingRequestHandler -> canHandle -> should return true when isApiRequest returns true', () => {
        expect(
            saveRatingRequestHandler.canHandle(handlerInput)
        ).toBe(true);
    });
    
    test('ratingHandler -> handle -> should respond to default Api ', async () => {
        const response = saveRatingRequestHandler.handle(handlerInput);
        const logSpy = jest.spyOn(console, 'log');
        expect(handlerInput.responseBuilder.withApiResponse)
            .toHaveBeenCalledWith(
                { 
                    "rating": "5"
                }
            );
        expect(logSpy).toHaveBeenCalledWith('Rating is 5');
    });

    test('ratingHandler -> handle -> should respond to custom api and not respond to default api ', async () => {
        saveRatingRequestHandler = new SaveRatingRequestHandler('custom_api', new CustomRatingRecorder());
        const response = saveRatingRequestHandler.handle(handlerInput);
        const logSpy = jest.spyOn(console, 'log');
        expect(handlerInput.responseBuilder.withApiResponse)
            .toHaveBeenCalledWith(
                { 
                    "rating": "5"
                }
            );
        expect(logSpy).toHaveBeenCalledWith(testString + " " + "5");
    });

    test('saveRatingRequestHandler -> canHandle -> should return false when isApiRequest returns false', () => {
        expect(
            saveRatingRequestHandler.canHandle(handlerInputforNegativeScenario)
        ).toBe(false);
    });
})