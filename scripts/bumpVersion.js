const fs = require('fs');
const appConfig = require('../app.json');

const versionArray = appConfig.expo.version.split('.');
const patchVersion = parseInt(versionArray[2], 10) + 1;
const newVersion = `${versionArray[0]}.${versionArray[1]}.${patchVersion}`;

appConfig.expo.version = newVersion;
// appConfig.expo.runtimeVersion = newVersion;

fs.writeFileSync('app.json', JSON.stringify(appConfig, null, 2));
console.log(`Version bumped to ${newVersion}`);