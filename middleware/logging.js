const { logger } = require('../services/logging');
const { ErrHTTPNotFound } = require('../errors');
const now = require('performance-now');

const log = (req, res, next) => {
  const startTime = now();
  const end = res.end;
  res.end = function(chunk, encoding) {
    // Compute the end time.
    const responseTime = Math.round(now() - startTime);

    // Get some extra goodies from the request.
    const userAgent = req.get('User-Agent');

    // Reattach the old end, and finish.
    res.end = end;
    res.end(chunk, encoding);

    // Log this out.
    logger.info(
      {
        traceID: req.id,
        url: req.originalUrl || req.url,
        method: req.method,
        statusCode: res.statusCode,
        userAgent,
        responseTime,
      },
      'http request'
    );
  };

  next();
};

const error = (err, req, res, next) => {
  // Don't log out an error for ErrHTTPNotFound as this is already
  // logged with the included request logger.
  if (!(err instanceof ErrHTTPNotFound)) {
    logger.error({ err }, 'http error');
  }

  next(err);
};

module.exports = { log, error };
