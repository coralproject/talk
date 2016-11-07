const mongoose = require('mongoose');
const enabled = require('debug').enabled;
const url = process.env.TALK_MONGO_URL || 'mongodb://localhost';

// Use native promises
mongoose.Promise = global.Promise;

if (enabled('talk:db')) {
  mongoose.set('debug', true);
}

try {
  mongoose.connect(url, (err) => {
    if (err) {throw err;}
    console.log('Connected to MongoDB!');
  });
} catch (err) {
  console.log('Cannot stablish a connection with MongoDB');
}

module.exports = mongoose;
