const mongoose = require('mongoose');
const debug = require('debug')('talk:db');
const queryDebuger = require('debug')('talk:db:query');

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

  queryDebuger(functionCall + params);
}

const enabled = require('debug').enabled;

// Pull the mongo url out of the environment.
let url = process.env.TALK_MONGO_URL;

// Reset the mongo url if we are in a testing environment.
// Every new mongo instance comes with a test database by
// default, this is consistent with common testing and use case practices.
if (process.env.NODE_ENV === 'test') {
  url = 'mongodb://localhost/test';
}

// Use native promises
mongoose.Promise = global.Promise;

// Check if debugging is enabled on the talk:db prefix.
if (enabled('talk:db')) {

  // Enable the mongoose debugger, here we wrap the similar print function
  // provided by setting the debug parameter.
  mongoose.set('debug', debugQuery);
}

// Connect to the Mongo instance.
mongoose.connect(url, (err) => {
  if (err) {
    throw err;
  }

  debug('connection established');
});

module.exports = mongoose;

// Here we include all the models that mongoose is used for, this ensures that
// when we import mongoose that we also start up all the indexing opreations
// here.
require('../models/action');
require('../models/asset');
require('../models/comment');
require('../models/setting');
require('../models/user');
