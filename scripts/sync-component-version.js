
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

