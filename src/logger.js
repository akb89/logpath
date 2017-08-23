const winston = require('winston');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'debug',
      colorize: true,
    }),
  ],
});

module.exports = logger;
