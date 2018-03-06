const { version } = require('../package.json');
const Logger = require('bunyan');
const uuid = require('uuid/v1');
const { LOGGING_LEVEL } = require('../config');

// Create the logging instance that all logger's are branched from.
function createLogger(name, id = uuid()) {
  return new Logger({
    src: true,
    name,
    id,
    version,
    level: LOGGING_LEVEL,
    serializers: Logger.stdSerializers,
  });
}

module.exports = { createLogger };
