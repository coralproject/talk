const { version } = require('../package.json');
const Logger = require('bunyan');
const { LOGGING_LEVEL, REVISION_HASH } = require('../config');

// Create the logging instance that all logger's are branched from.
function createLogger(name, traceID) {
  return new Logger({
    src: true,
    name,
    traceID,
    version,
    revision: REVISION_HASH,
    level: LOGGING_LEVEL,
    serializers: Logger.stdSerializers,
  });
}

module.exports = { createLogger };
