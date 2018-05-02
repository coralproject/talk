const mongoose = require('../services/mongoose');

beforeAll(function(done) {
  mongoose.connection.on('open', function(err) {
    if (err) {
      return done(err);
    }

    return done();
  });
}, 30000);

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

afterAll(async function() {
  await mongoose.disconnect();
});
