const mongoose = require('../mongoose');

beforeEach(function (done) {
  function clearDB() {
    for (let collection in mongoose.connection.collections) {
      mongoose.connection.collections[collection].remove(function() {});
    }
    return done();
  }

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
});

after(function (done) {
  mongoose.disconnect();
  return done();
});
