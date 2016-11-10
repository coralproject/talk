const mongoose = require('mongoose');
const debug = require('debug')('talk:db');
const enabled = require('debug').enabled;
const url = process.env.TALK_MONGO_URL || 'mongodb://localhost';

// Use native promises
mongoose.Promise = global.Promise;

if (enabled('talk:db')) {
  mongoose.set('debug', true);
}

try {
  mongoose.connect(url, (err) => {
    if (err) {
      throw err;
    }

    debug('Connected to MongoDB!');
  });
} catch (err) {
  console.error('Cannot stablish a connection with MongoDB', err);
}

module.exports = mongoose;
