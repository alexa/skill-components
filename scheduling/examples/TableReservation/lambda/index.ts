// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { SkillBuilders } from 'ask-sdk-core';
import { SchedulingComponent } from '@alexa-skill-components/scheduling';


import { skillDomain } from './skill-config';
import { loggingRequestInterceptor, loggingResponseInterceptor } from "./util"
import { ContinueSessionHandler } from "./handlers"

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.

exports.handler = SkillBuilders.custom()
    .addRequestHandlers(
        // register all the handlers required for scheduling component to function;
        // making sure to pass the fully qualified names (FQN) of the APIs that
        // are required to be defined by skills using scheduling component

        new ContinueSessionHandler(),

        ...SchedulingComponent.createHandlers(
            `${skillDomain}.bookTicketAction`,
            `${skillDomain}.getBookingsApi`,
            `${skillDomain}.selectBookingApi`,
            `${skillDomain}.indexOfBookingByNameApi`,
            `${skillDomain}.modifyAction`,
            `${skillDomain}.cancelAction`
        )
    )
    .addRequestInterceptors(loggingRequestInterceptor)
    .addResponseInterceptors(loggingResponseInterceptor)
    .lambda();