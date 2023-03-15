// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { SkillBuilders } from 'ask-sdk-core';

import { CatalogExplorer } from '@alexa-skill-components/catalog-explorer';

import { skillDomain } from './skill-config';
import { loggingRequestInterceptor, loggingResponseInterceptor } from "./util"

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.

exports.handler = SkillBuilders.custom()
    .addRequestHandlers(
        // register all the handlers required for catalog explorer component to function;
        // making sure to pass the fully qualified names (FQN) of the APIs that
        // are required to be defined by skills using catalog explorer
        ...CatalogExplorer.createHandlers(
            `${skillDomain}.getPage`,
            `${skillDomain}.indexOfItemByNameApi`,
            `${skillDomain}.selectItemApi`,
            `${skillDomain}.search_`,
            `${skillDomain}.getProperty_`,
            `${skillDomain}.performAction_`,
            `${skillDomain}.acceptAction`
        )
    )
    .addRequestInterceptors(loggingRequestInterceptor)
    .addResponseInterceptors(loggingResponseInterceptor)
    .lambda();