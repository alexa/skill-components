import { HandlerInput, ResponseBuilder, AttributesManager } from 'ask-sdk-core';
import { GetPageHandler } from "../../lambda/handlers/get-page-handler";
import { CatalogExplorer } from '../../lambda/interface';
import * as util from '../../lambda/util';
import handlerInputObject from "../resources/getPageHandlerInput.json";
import { FixedProvider } from "../../lambda/providers/fixed-provider"
import { CatalogExplorerSessionState } from '../../lambda/state';
import { PagingDirection } from '../../lambda/catalog-provider';
import {
    testList,
    sessionProviderState,
    sessionActiveCatalog,
    validSearchConditions
} from '../resources/test-common';

let handlerInput: HandlerInput;
let getPageHandler: GetPageHandler;

let withApiResponseMock = jest.fn(() => handlerInput.responseBuilder);
let getResponseMock = jest.fn(() => handlerInput.responseBuilder);
let withShouldEndSessionMock = jest.fn(() => handlerInput.responseBuilder);

let getSessionAttributesMock = jest.fn().mockReturnValue({
    "_ac_catalogExplorer": {
        "activeCatalog": sessionActiveCatalog,
        "providerState": sessionProviderState,
        "argsState": {
            "upcomingPageToken": "0",
            "searchConditions": validSearchConditions,
            "currentPageSize": 2,
            "pagingDirection": PagingDirection.NEXT,
            "currentPageTokens": {
                "prevPageToken": undefined,
                "currentPageToken": undefined,
                "nextPageToken": undefined
            }
        }
    }
});

let setSessionAttributesMock = jest.fn(() => handlerInput.responseBuilder);
let isApiRequestMock = jest.fn();

handlerInput = JSON.parse(JSON.stringify(handlerInputObject));

beforeEach(() => {
    jest.clearAllMocks();
    getPageHandler = new GetPageHandler();

    getPageHandler.getActiveCatalog = jest.fn().mockReturnValue(sessionActiveCatalog);

    (util.isApiRequest as any) = isApiRequestMock;
    isApiRequestMock.mockReturnValue(true);

    handlerInput.responseBuilder = {
        withApiResponse: withApiResponseMock,
        getResponse: getResponseMock,
        withShouldEndSession: withShouldEndSessionMock,
    } as unknown as ResponseBuilder;

    handlerInput.attributesManager = {
        getSessionAttributes: getSessionAttributesMock,
        setSessionAttributes: setSessionAttributesMock,
    } as unknown as AttributesManager;


    CatalogExplorer.buildCatalogReference(
        handlerInput,
        new FixedProvider(testList),
        2
    )
    jest.spyOn(console, 'error').mockImplementation(() => { });
    jest.spyOn(console, 'log').mockImplementation(() => { });
});

test('GetPageHandler -> canHandle -> should return true when util.isApiRequest returns true', () => {
    expect(
        getPageHandler.canHandle(handlerInput)
    ).toBe(true);
});

test('GetPageHandler -> canHandle -> should return false when util.isApiRequest returns false', () => {
    isApiRequestMock.mockReturnValue(false);

    expect(
        getPageHandler.canHandle(handlerInput)
    ).toBe(false);
});


test('GetPageHandler -> handle -> should return correct Page value result when handlerInput argument is used', () => {
    CatalogExplorer.useSession = false;
    getPageHandler.handle(handlerInput);

    expect(util.getApiArguments(handlerInput)).toMatchObject(
        {
            "catalogRef": {
                "id": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
                "catalogProviderName": "ac.FixedCatalogCursor",
                "pageSize": 2

            },
            "searchConditions": {
                "genre": "horror"
            },
            "pageToken": "0"
        }
    );

    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            {
                rescoped: 0,
                searchConditions: {
                    "genre": "horror"
                },
                recommendations: {
                    items: [
                        {
                            "genre": "horror",
                            "author": "author name"
                        },
                        {
                            "genre": "horror",
                            "author": "author name3"
                        }
                    ],
                    itemCount: 2,
                    prevPageToken: undefined,
                    nextPageToken: undefined
                }
            }
        );
});

test('GetPageHandler -> handle -> should return correct Page value result when Session State is used', () => {

    CatalogExplorer.useSession = true;

    getPageHandler.handle(handlerInput);

    expect(util.getApiArguments(handlerInput)).toMatchObject(
        {
            "catalogRef": {
                "id": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
                "catalogProviderName": "ac.FixedCatalogCursor",
                "pageSize": 2
            },
            "searchConditions": {
                "genre": "horror"
            },
            "pageToken": "0"
        }
    );


    // expect(CatalogExplorerSessionState.load(handlerInput).logInvalidArguments).toBeCalled()
    expect(handlerInput.responseBuilder.withApiResponse)
        .toHaveBeenCalledWith(
            {
                rescoped: 0,
                searchConditions: {
                    "genre": "horror"
                },
                recommendations: {
                    items: [
                        {
                            "genre": "horror",
                            "author": "author name"
                        },
                        {
                            "genre": "horror",
                            "author": "author name3"
                        }
                    ],
                    itemCount: 2,
                    prevPageToken: undefined,
                    nextPageToken: undefined
                }
            }
        );
});