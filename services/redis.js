const redis = require('redis');
const debug = require('debug')('talk:services:redis');
const {
  REDIS_URL
} = require('../config');

const connectionOptions = {
  url: REDIS_URL,
  retry_strategy: function(options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {

      // End reconnecting on a specific error and flush all commands with a individual error
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {

      // End reconnecting after a specific timeout and flush all commands with a individual error
      return new Error('Retry time exhausted');
    }

    if (options.times_connected > 10) {

      // End reconnecting with built in error
      return undefined;
    }

    // reconnect after
    return Math.max(options.attempt * 100, 3000);
  }
};

module.exports = {
  connectionOptions,
  createClient() {
    let client = redis.createClient(connectionOptions);

    client.ping((err) => {
      if (err) {
        console.error('Can\'t ping the redis server!');

        throw err;
      }

      debug('connection established');
    });

    return client;
  }
};
