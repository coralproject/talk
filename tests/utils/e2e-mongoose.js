const mongoose = require('../../mongoose');

// Ensure the NODE_ENV is set to 'test',
// this is helpful when you would like to change behavior when testing.
function clearDB() {
  console.log('Clearing DB');
  for (let i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove(function() {});
  }
}

module.exports = {
  before: () => {
    const url = process.env.TALK_MONGO_URL || 'mongodb://localhost';
    return mongoose.connect(url, (err) => {
      if (err) {
        throw err;
      }
      debug('Connected to MongoDB!');
    });
  },
  beforeEach: () => {
    console.log('beforeEach', mongoose.connection.name);
    if (mongoose.connection.readyState === 0) {
      mongoose.on('open', function() {
        if (err) {
          throw err;
        }

        return clearDB();
      });
    } else {
      return clearDB();
    }
  },
  after: () => {
    clearDB();
    mongoose.disconnect();
  }
};
