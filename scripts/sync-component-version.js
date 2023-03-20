
const fs = require('fs');
const path =  require('path');
const { cwd } = require('process');
path.resolve(__dirname, `package.json`)

const componentPackageJson = require(cwd() + `/package.json`)
const version = componentPackageJson.version;
const skillPackageJsonPath = "src/version.acdl"

const VERSION_PREFIX = "componentVersion="
const VERSON_REGEX = `\"\\d+\\.\\d+\\.\\d+\"`
const REGEX_STRING = `(${VERSION_PREFIX})${VERSON_REGEX}`
const REPLACE_STRING = `${VERSION_PREFIX}"${version}"`

const regex = new RegExp(REGEX_STRING);


if (fs.existsSync(skillPackageJsonPath)) {
    //Reads version.acdl and syncs component version from package.json
    fs.readFile(skillPackageJsonPath, 'utf-8', (err, data) => {
        var result = data.replace(regex, REPLACE_STRING);
        console.log("Syncing component version")
        fs.writeFile(skillPackageJsonPath, result, function writeJSON(err) {
            if (err) return console.log(err);
        });
    })
}
    // generateVersionFile(version)

// } else {

// }

// function generateVersionFile(version){
// const s = `// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// // SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// // Licensed under the Amazon Software License  http://aws.amazon.com/asl/

// namespace com.amazon.alexa.skill.components.catalog_explorer.version

// version="0.0.2222"`
// fs.writeFile(skillPackageJsonPath, s, function writeJSON(err) {
//     if (err) return console.log(err);
// });
// }

