const mongoose = require('mongoose');
const debug = require('debug')('talk:db');
const enabled = require('debug').enabled;
let url = process.env.TALK_MONGO_URL || 'mongodb://localhost';

if (process.env.NODE_ENV === 'test') {
  url = 'mongodb://localhost/coral-test';
}

// Use native promises
mongoose.Promise = global.Promise;

if (enabled('talk:db')) {
  mongoose.set('debug', true);
}

mongoose.connect(url, (err) => {
  if (err) {
    throw err;
  }

  debug('connection established');
});

module.exports = mongoose;
