const mongoose = require('../../services/mongoose');

before(function(done) {
  this.timeout(30000);

  mongoose.connection.on('open', function(err) {
    if (err) {
      return done(err);
    }

    return done();
  });
});

beforeEach(async () => {
  await Promise.all(
    Object.keys(mongoose.connection.collections).map(collection => {
      return new Promise((resolve, reject) => {
        mongoose.connection.collections[collection].remove(function(err) {
          if (err) {
            return reject(err);
          }

          return resolve();
        });
      });
    })
  );
});

after(async function() {
  mongoose.disconnect();
});
