const {createClient} = require('../../services/redis');
const cache = require('../../services/cache');
const client = createClient();

beforeEach(() => Promise.all([
  new Promise((resolve, reject) => client.flushdb((err) => {
    if (err) {
      return reject(err);
    }

    return resolve();
  })),
  cache.init(),
]));
