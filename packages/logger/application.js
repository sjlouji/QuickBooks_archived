require('winston-loggly-bulk');

const fs = require('fs');
const path = require('path');
const winston = require('winston');

const config = require('config');

const { httpContext } = require('quick-middleware');

function applicationLogger(namespace) {
  const logDir = path.join(__dirname, '..', '..', 'logs');

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  const logPath = path.join(logDir, `${namespace}.log`);
  const transports = [
    new winston.transports.File({
      filename: logPath,
      handleExceptions: true,
      json: false,
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      colorize: false,
      timestamp: true,
    }),
    new winston.transports.Loggly({
      level: 'info',
      inputToken: config.loggly.token,
      subdomain: config.loggly.domain,
      tags: [config.loggly.tag],
      json: true,
    }),
  ];

  if (config.environment === 'development') {
    transports.push(new winston.transports.Console(
      {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        timestamp: true,
      }
    ));
  }

  const winstonLogger = new winston.createLogger({
    transports,
    exitOnError: false,
  });

  if (!config.loggly.isEnabled) {
    winstonLogger.remove(winston.transports.Loggly);
  }

  const stream = {
    write(message, encoding) {
      winstonLogger.info(message);
    },
  };

  winstonLogger.stream = stream;

  // Wrap Winston logger to print reqId in each log
  const formatMessage = (message) => {
    const reqId = httpContext.get('books');
    console.log('message',message.body)
    message = reqId ? `${reqId} - ${message}` : message;
    return message;
  };

  const logger = {
    log(level, message) {
      winstonLogger.log(level, formatMessage(message));
    },
    error(message) {
      winstonLogger.error(formatMessage(message));
    },
    warn(message) {
      winstonLogger.warn(formatMessage(message));
    },
    verbose(message) {
      winstonLogger.verbose(formatMessage(message));
    },
    info(message) {
      winstonLogger.info(formatMessage(message));
    },
    debug(message) {
      winstonLogger.debug(formatMessage(message));
    },
    silly(message) {
      winstonLogger.silly(formatMessage(message));
    },
  };

  return logger;
}

module.exports = applicationLogger;