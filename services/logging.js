const { version } = require('../package.json');
const Logger = require('bunyan');
const uuid = require('uuid/v1');

// Create the logging instance that all logger's are branched from.
function createLogger(name, id = uuid()) {
  return new Logger({
    src: true,
    name,
    id,
    version,
    serializers: { req: Logger.stdSerializers.req },
  });
}

module.exports = { createLogger };
