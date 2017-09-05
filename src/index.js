const fs = require('fs');
const path = require('path');
const os = require('os');
const debug = require('debug')('logpath');

function getAppName() {
  const packageFile = path.join(process.cwd(), 'package.json');
  const packageData = JSON.parse(fs.readFileSync(packageFile, 'utf-8'));
  return packageData.productName || packageData.name;
}

function createDirIfNotExists(...params) {
  let dirPath;
  try {
    dirPath = path.join(...params);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    return dirPath;
  } catch (err) {
    debug(err.message);
  }
  return false;
}

function getDefaultLogDirPath() {
  return createDirIfNotExists(process.cwd(), 'logs');
}

function getPlatformLogDirPath(appName) {
  const homeDir = os.homedir ? os.homedir() : process.env.HOME;
  switch (process.platform) {
    case 'linux': {
      return createDirIfNotExists('/var/log', appName)
      || createDirIfNotExists(process.env.XDG_CONFIG_HOME, appName)
      || createDirIfNotExists(homeDir, '.config', appName)
      || createDirIfNotExists(process.env.XDG_DATA_HOME, appName)
      || createDirIfNotExists(homeDir, '.local', 'share', appName);
    }
    case 'darwin': {
      return createDirIfNotExists(homeDir, 'Library', 'Logs', appName)
      || createDirIfNotExists(homeDir, 'Library', 'Application Support', appName);
    }
    case 'win32': {
      return createDirIfNotExists(process.env.APPDATA, appName)
      || createDirIfNotExists(homeDir, 'AppData', 'Roaming', appName);
    }
    default: {
      throw new Error(`Unsupported platform: '${process.platform}'`);
    }
  }
}

const logdirpath = {
  createAndGetLogFilePath: () => {
    let appName;
    let logDirPath;
    try {
      appName = getAppName();
      try {
        logDirPath = getPlatformLogDirPath(appName);
      } catch (err) {
        logDirPath = getDefaultLogDirPath();
      }
    } catch (err) {
      debug('Could not retrieve app name from package.json');
      debug(err.message);
      logDirPath = getDefaultLogDirPath();
    }
    if (!logDirPath) {
      throw new Error('Could not create logs directory');
    }
    debug(`Saving logs to: ${logDirPath}`);
    return logDirPath;
  },
};

module.exports = logdirpath;
