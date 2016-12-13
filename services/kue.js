const kue = require('kue');
const redis = require('./redis');

module.exports = {
  queue: kue.createQueue({
    redis: {
      createClientFactory: () => redis.createClient()
    }
  }),
  kue
};
