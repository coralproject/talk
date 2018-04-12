const mongoose = require('../services/mongoose');

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
