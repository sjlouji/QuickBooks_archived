const ms = require('ms');
const url = require('url');
const useragent = require('useragent');

function requestLogger(logger) {
  return (req, res, next) => {
    const startTime = new Date();
    const requestEnd = res.end;
    const requestBody = JSON.stringify(req.body);
    const requestedUrl = req.originalUrl || req.url;

    const requestIp = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
    const userAgent = useragent.parse(req.headers['user-agent']).toString();

    logger.info(`Started : ${req.method} ${requestedUrl}`);
    logger.info(`Body : ${requestBody}`);
    logger.info(`IP : ${requestIp} User-Agent : ${userAgent}`);

    const patchedEnd = (chunk, encoding) => {
      const responseTime = ms(new Date() - startTime);

      res.end = requestEnd;
      res.end(chunk, encoding);

      logger.info(`Ended : ${req.method} ${requestedUrl} ${res.statusCode} ${responseTime}`);
    };

    res.end = patchedEnd;
    next();
  };
}

module.exports = requestLogger;
