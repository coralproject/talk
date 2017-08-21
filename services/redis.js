const redis = require('redis');
const debug = require('debug')('talk:services:redis');
const enabled = require('debug').enabled('talk:services:redis');
const {
  REDIS_URL,
  REDIS_RECONNECTION_MAX_ATTEMPTS,
  REDIS_RECONNECTION_MAX_RETRY_TIME,
  REDIS_RECONNECTION_BACKOFF_FACTOR,
  REDIS_RECONNECTION_BACKOFF_MINIMUM_TIME,
} = require('../config');

const attachMonitors = (client) => {
  debug('client created');

  // Debug events.
  if (enabled) {
    client.on('ready', () => debug('client ready'));
    client.on('connect', () => debug('client connected'));
    client.on('reconnecting', () => debug('client connection lost, attempting to reconnect'));
    client.on('end', () => debug('client ended'));
  }

  // Error events.
  client.on('error', (err) => {
    if (err) {
      console.error('Error connecting to redis:', err);
    }
  });
};

const connectionOptions = {
  url: REDIS_URL,
  retry_strategy: function(options) {
    if (options.error && options.error.code !== 'ECONNREFUSED') {

      debug('retry strategy: none, an error occured');

      // End reconnecting on a specific error and flush all commands with a individual error
      return options.error;
    }
    if (options.total_retry_time > REDIS_RECONNECTION_MAX_RETRY_TIME) {

      debug('retry strategy: none, exhausted retry time');

      // End reconnecting after a specific timeout and flush all commands with a individual error
      return new Error('Retry time exhausted');
    }

    if (options.attempt > REDIS_RECONNECTION_MAX_ATTEMPTS) {

      debug('retry strategy: none, exhausted retry attempts');

      // End reconnecting with built in error
      return undefined;
    }

    // reconnect after
    const delay = Math.max(options.attempt * REDIS_RECONNECTION_BACKOFF_FACTOR, REDIS_RECONNECTION_BACKOFF_MINIMUM_TIME);

    debug(`retry strategy: try to reconnect ${delay} ms from now`);

    return delay;
  }
};

const createClient = () => {
  let client = redis.createClient(connectionOptions);

  // Attach the monitors that will print debug messages to the console.
  attachMonitors(client);

  client.ping((err) => {
    if (err) {
      console.error('Can\'t ping the redis server!');

      throw err;
    }
  });

  return client;
};

module.exports = {
  connectionOptions,
  attachMonitors,
  createClient,
  createClientFactory: () => {
    let client = null;

    return () => {
      if (client !== null) {
        return client;
      }

      client = createClient();

      return client;
    };
  }
};
