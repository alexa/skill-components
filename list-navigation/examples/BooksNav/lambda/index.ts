// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { SkillBuilders } from 'ask-sdk-core';

import { ListNav, EndSessionHandler } from '@alexa-skill-components/list-navigation';

import * as Handlers from "./handlers";
import { skillDomain } from './skill-config';
import { loggingRequestInterceptor, loggingResponseInterceptor } from "./util"

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
export const handler = SkillBuilders.custom()
    .addRequestHandlers(
        // register all the handlers defined in this example skill
        ...Handlers.createHandlers(),

        // register all the handlers required for list navigation component to function;
        // making sure to pass the fully qualified names (FQN) of the three APIs that
        // are required to be defined by skills using list navigation
        ...ListNav.createHandlers(
            `${skillDomain}.common.getBooksPageApi`,
            `${skillDomain}.common.selectBookApi`,
            `${skillDomain}.common.indexOfBookByNameApi`
        ),

        // special API just to indicate that the session should end
        new EndSessionHandler(`${skillDomain}.common.endSession`)
    )
    .addRequestInterceptors(loggingRequestInterceptor)
    .addResponseInterceptors(loggingResponseInterceptor)
    .lambda();