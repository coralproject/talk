const mongoose = require('mongoose');
const debug = require('debug')('talk:db');
const enabled = require('debug').enabled;
const url = process.env.TALK_MONGO_URL || 'mongodb://localhost';

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
