const mongoose = require('../mongoose');

beforeEach(function (done) {
  function clearDB() {
    for (let i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
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
