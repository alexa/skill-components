// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { RatingRecorder } from "./rating-recorder";

//The default LogRatingRecorder simply records the rating to the console log (ended in in cloudwatch if AWS Lambda is used for a skill endpoint).
export class LogRatingRecorder implements RatingRecorder { 
    handleRating(rating: number) {
        console.log(`Rating is ${rating}`);
    }
 }