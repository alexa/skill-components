// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { HandlerInput, RequestHandler } from 'ask-sdk-core';

import { Utils, ListNav, FixedListProvider } from '@alexa-skill-components/list-navigation';

import { defaultPageSize, skillDomain } from '../../skill-config';
import { BOOKS } from "../../test-data"

// simple API to build and return a list reference for the test list of books, need this
// list reference in order to utilize the list navigation component
export class GetBooksHandler implements RequestHandler {
    canHandle(handlerInput : HandlerInput) : boolean {
        return Utils.isApiRequest(handlerInput, `${skillDomain}.pagination.getBooks`);
	}

    handle(handlerInput: HandlerInput) {
        const listRef = ListNav.buildListReference(
            handlerInput,
            new FixedListProvider(BOOKS),
            defaultPageSize
        );

        return handlerInput.responseBuilder
            .withApiResponse(listRef)
            .withShouldEndSession(false)
            .getResponse();
    }
}