const {createClient} = require('../../services/redis');

// Create a redis client to use for clearing the database.
const client = createClient();

module.exports.clearDB = () =>
  new Promise((resolve, reject) =>
    client.flushdb((err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    })
  );
