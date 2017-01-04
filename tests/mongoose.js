const mongoose = require('../services/mongoose');

function waitTillConnect() {
  return new Promise((resolve, reject) => {
    mongoose.connection.on('open', function(err) {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
}

before(function(done) {
  this.timeout(30000);

  waitTillConnect()
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

beforeEach(function(done) {
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
});

after(function(done) {
  mongoose.disconnect();
  return done();
});
