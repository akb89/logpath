# logpath
[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![Dependencies][david-dep-image]][david-url]
[![MIT License][license-image]][license-url]

A simple module to get a custom node.js app log dir path across platforms

## Install
```shell
$ npm install --save logpath
```

## Use
```
const logpath = require('logpath');

const logDirPath = logpath.getLogDirPath();
```

logpath creates directory if not found and tries to return log directory paths in the following order:

### On Linux
1. `/var/log/${APP_NAME}`
2. `${XDG_CONFIG_HOME}/${APP_NAME}`
3. `${HOME}/.config/${APP_NAME}`
4. `${XDG_DATA_HOME}/${APP_NAME}`
5. `${HOME}/.local/share/${APP_NAME}`

### On MacOS
1. `${HOME}/Library/Logs/${APP_NAME}`
2. `${HOME}/Library/Application Support/${APP_NAME}`

### On Windows
1. `${APPDATA}/${APP_NAME}`
2. `${HOME}/AppData/Roaming/${APP_NAME}`

Where ${APP_NAME} is the name of the application using logpath, retrieved from `package.json`

### Default
On any other platform, or if the directory path could not be returned (e.g. due to lack of read/write privileges), logpath will try and create a `logs` dir
under the application's root folder.

[npm-version-image]:https://img.shields.io/npm/v/logpath.svg?style=flat-square
[npm-downloads-image]:https://img.shields.io/npm/dt/logpath.svg?style=flat-square
[npm-url]:https://www.npmjs.com/package/logpath
[license-image]:http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square
[license-url]:LICENSE.txt
[david-dep-image]: https://david-dm.org/akb89/logpath.svg?style=flat-square
[david-url]: https://david-dm.org/akb89/logpath
