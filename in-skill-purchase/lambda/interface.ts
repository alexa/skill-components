// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import {RequestHandler} from "ask-sdk-core";
import {
    DelegateFlowForDenyHandler,
    GetInSkillProductListHandler,
    GetProductIdHandler,
    GetPurchaseResultHandler,
    ResumeResponseHandler,
    SendBuyDirectiveHandler,
    SendCancelDirectiveHandler,
    SendUpsellDirectiveHandler
} from './handlers';

export class in_skill_purchase {
    static createHandlers(): RequestHandler[] {
        return [
        new DelegateFlowForDenyHandler(),
        new GetInSkillProductListHandler(),
        new GetProductIdHandler(),
        new GetPurchaseResultHandler(),
        new ResumeResponseHandler(),
        new SendBuyDirectiveHandler(),
        new SendCancelDirectiveHandler(),
        new SendUpsellDirectiveHandler()
        ];
    }
}


