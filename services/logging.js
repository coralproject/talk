const { version } = require('../package.json');
const Logger = require('bunyan');
const { LOGGING_LEVEL, REVISION_HASH } = require('../config');
const logger = new Logger({
  src: true,
  name: 'talk',
  version,
  revision: REVISION_HASH,
  level: LOGGING_LEVEL,
  serializers: Logger.stdSerializers,
});

// Create the logging instance that all logger's are branched from.
function createLogger(name, traceID) {
  return logger.child({ origin: name, traceID });
}

module.exports = { logger, createLogger };
