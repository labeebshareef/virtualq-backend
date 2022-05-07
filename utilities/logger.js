'use strict';

const appRoot = require('app-root-path');
const winston = require('winston');
require('winston-daily-rotate-file');

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    handleExceptions: true,
    json: true,
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false,
});

logger.stream = {
  write: function (message) {
    logger.info(message);
  },
};

module.exports = logger;
