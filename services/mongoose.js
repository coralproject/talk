const {
  MONGO_URL,
  WEBPACK,
  CREATE_MONGO_INDEXES,
  LOGGING_LEVEL,
} = require('../config');
const { logger } = require('./logging');
const mongoose = require('mongoose');

// Provide a newly wrapped debugQuery function which wraps the `debug` package.
function debugQuery(name, operation, ...args) {
  logger.debug(
    {
      query: `db.${name}.${operation}(${args
        .map(arg => JSON.stringify(arg))
        .join(', ')})`,
    },
    'mongodb query'
  );
}

// Use native promises
mongoose.Promise = global.Promise;

// Check if verbose logging is enabled.
if (['debug', 'trace'].includes(LOGGING_LEVEL)) {
  // Enable the mongoose debugger, here we wrap the similar print function
  // provided by setting the debug parameter.
  mongoose.set('debug', debugQuery);
}

if (WEBPACK) {
  logger.debug('Not connecting to mongodb during webpack build');

  // @wyattjoh: We didn't call connect, but because we include mongoose, it will
  // hold the socket ready, preventing node from exiting. Calling disconnect
  // here just ensures that the application can quit correctly.
  mongoose.disconnect();
} else {
  mongoose.connection.on('connected', () => logger.debug('mongodb connected'));
  mongoose.connection.on('disconnected', () =>
    logger.debug('mongodb disconnected')
  );

  // Connect to the Mongo instance.
  mongoose
    .connect(
      MONGO_URL,
      {
        config: {
          autoIndex: CREATE_MONGO_INDEXES,
        },
      }
    )
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = mongoose;

// Here we include all the models that mongoose is used for, this ensures that
// when we import mongoose that we also start up all the indexing operations
// here. No point also in importing this if we're not actually doing any
// indexing now.
if (CREATE_MONGO_INDEXES) {
  require('../models/action');
  require('../models/asset');
  require('../models/comment');
  require('../models/migration');
  require('../models/setting');
  require('../models/user');
  require('./migration');
}
