const { MONGO_URL, WEBPACK, CREATE_MONGO_INDEXES } = require('../config');

const mongoose = require('mongoose');
const debug = require('debug')('talk:db');
const enabled = require('debug').enabled;
const queryDebugger = require('debug')('talk:db:query');

// Loading the formatter from Mongoose:
//
// https://github.com/Automattic/mongoose/blob/1a93d1f4d12e441e17ddf451e96fbc5f6e8f54b8/lib/drivers/node-mongodb-native/collection.js#L182
//
// so we can wrap parameters.
const formatter = require('mongoose').Collection.prototype.$format;

// Provide a newly wrapped debugQuery function which wraps the `debug` package.
function debugQuery(name, i, ...args) {
  let functionCall = ['db', name, i].join('.');
  let _args = [];
  for (let j = args.length - 1; j >= 0; --j) {
    if (formatter(args[j]) || _args.length) {
      _args.unshift(formatter(args[j]));
    }
  }

  let params = `(${_args.join(', ')})`;

  queryDebugger(functionCall + params);
}

// Use native promises
mongoose.Promise = global.Promise;

// Check if debugging is enabled on the talk:db prefix.
if (enabled('talk:db:query')) {
  // Enable the mongoose debugger, here we wrap the similar print function
  // provided by setting the debug parameter.
  mongoose.set('debug', debugQuery);
}

if (WEBPACK) {
  debug('Not connecting to mongodb during webpack build');

  // @wyattjoh: We didn't call connect, but because we include mongoose, it will hold the socket ready,
  // preventing node from exiting. Calling disconnect here just ensures that the application
  // can quit correctly.
  mongoose.disconnect();
} else {
  // Connect to the Mongo instance.
  mongoose
    .connect(MONGO_URL, {
      useMongoClient: true,
      config: {
        autoIndex: CREATE_MONGO_INDEXES,
      },
    })
    .then(() => {
      debug('connection established');
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = mongoose;

// Here we include all the models that mongoose is used for, this ensures that
// when we import mongoose that we also start up all the indexing operations
// here.
require('../models/action');
require('../models/asset');
require('../models/comment');
require('../models/setting');
require('../models/user');
require('./migration');
