// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/


import { HandlerInput, RequestHandler } from "ask-sdk-core";
import { SaveRatingRequestHandler } from "./handlers/save-rating-handler";
import { RatingRecorder } from "./recorders/rating-recorder";
import { LogRatingRecorder } from "./recorders/log-rating-recorder";

export { 
    RatingRecorder,
    SaveRatingRequestHandler,
    LogRatingRecorder
    
};
