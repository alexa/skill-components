// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import { RequestHandler } from "ask-sdk-core";

import { GetBooksHandler } from "./get-books";

export function createHandlers(): RequestHandler[] {
    return [
        new GetBooksHandler()
    ];
}