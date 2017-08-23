const fs = require('fs');
const path = require('path');
const os = require('os');
const logger = require('./logger');

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
  } catch (err) {
    logger.warn(err.message);
  }
  return dirPath;
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
      return createDirIfNotExists(homeDir, 'Library', 'Logs', appName) || createDirIfNotExists(homeDir, 'Library', 'Application Support', appName);
    }
    case 'win32': {
      return createDirIfNotExists(process.env.APPDATA, appName) || createDirIfNotExists(homeDir, 'AppData', 'Roaming', appName);
    }
    default: {
      throw new Error(`Unsupported platform: '${process.platform}'`);
    }
  }
}

const logdirpath = {
  getLogDirPath: () => {
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
      logger.warn('Could not retrieve app name from package.json');
      logger.debug(err.message);
      logDirPath = getDefaultLogDirPath();
    }
    if (!logDirPath) {
      throw new Error('Could not create logs directory');
    }
    logger.info(`Saving logs to: ${logDirPath}`);
  },
};

module.exports = logdirpath;
