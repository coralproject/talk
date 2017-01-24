const mongoose = require('../../services/mongoose');

module.exports = {};

module.exports.waitTillConnect = function(done) {
  mongoose.connection.on('open', function(err) {
    if (err) {
      return done(err);
    }

    return done();
  });
};

module.exports.clearDB = function(done) {
  Promise.all(Object.keys(mongoose.connection.collections).map((collection) => {
    return new Promise((resolve, reject) => {
      mongoose.connection.collections[collection].remove(function(err) {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }))
  .then(() => {
    done();
  })
  .catch((err) => {
    done(err);
  });
};

module.exports.disconnect = function(done) {
  mongoose.disconnect();
  return done();
};
