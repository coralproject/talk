const mongoose = require('../../services/mongoose');

// Ensure the NODE_ENV is set to 'test',
// this is helpful when you would like to change behavior when testing.
function clearDB() {
  // console.log('Clearing DB', mongoose.connection);
  for (let i in mongoose.connection.collections) {
    // console.log('Clearing', i);
    mongoose.connection.collections[i].remove(function() {});
  }
}

module.exports = {
  before: () => {
    clearDB();
  },
  beforeEach: () => {
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
