const mongoose = require('../../services/mongoose');

const models = [
  require('../../models/action'),
  require('../../models/asset'),
  require('../../models/comment'),
  require('../../models/migration'),
  require('../../models/setting'),
  require('../../models/user'),
  require('../../models/migration'),
];

before(async function() {
  this.timeout(30000);

  // Ensure we can connect to the database.
  await new Promise((resolve, reject) => {
    mongoose.connection.on('open', err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });

  // Ensure all the models have indexes created.
  await Promise.all(models.map(model => model.ensureIndexes()));
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
