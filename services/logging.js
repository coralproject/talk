const { version } = require('../package.json');
const path = require('path');
const { createLogger: createBunyanLogger, stdSerializers } = require('bunyan');
const { LOGGING_LEVEL, REVISION_HASH } = require('../config');
const debug = require('bunyan-debug-stream');

// Streams enables the ability for development logs to be readable to a human,
// but will send JSON logs in production that's parsable by a system like ELK.
const streams = (() => {
  // In development, use the debug stream printer.
  if (process.env.NODE_ENV !== 'production') {
    return [
      {
        level: LOGGING_LEVEL,
        type: 'raw',
        stream: debug({
          basepath: path.resolve(__dirname, '..'),
          forceColor: true,
        }),
      },
    ];
  }

  // In production, emit JSON.
  return [{ stream: process.stdout, level: LOGGING_LEVEL }];
})();

// logger is the base logger used by all logging systems in Talk.
const logger = createBunyanLogger({
  src: true,
  name: 'talk',
  version,
  revision: REVISION_HASH,
  streams,
  serializers: stdSerializers,
});

/**
 *
 * @param {String} origin the origin name used by the logger
 * @param {String} traceID the id of the request being made
 */
const createLogger = (origin, traceID) => logger.child({ origin, traceID });

module.exports = { logger, createLogger };
