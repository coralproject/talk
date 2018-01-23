const Redis = require('ioredis');
const merge = require('lodash/merge');
const debug = require('debug')('talk:services:redis');
const enabled = require('debug').enabled('talk:services:redis');
const {
  REDIS_URL,
  REDIS_RECONNECTION_BACKOFF_FACTOR,
  REDIS_RECONNECTION_BACKOFF_MINIMUM_TIME,
  REDIS_CLIENT_CONFIG,
  REDIS_CLUSTER_MODE,
  REDIS_CLUSTER_CONFIGURATION,
} = require('../config');

const attachMonitors = client => {
  debug('client created');

  // Debug events.
  if (enabled) {
    client.on('connect', () => debug('client connected'));
    client.on('ready', () => debug('client ready'));
    client.on('close', () => debug('client closed the connection'));
    client.on('reconnecting', () =>
      debug('client connection lost, attempting to reconnect')
    );
    client.on('end', () => debug('client ended'));
  }

  // Error events.
  client.on('error', err => {
    if (err) {
      console.error('Error connecting to redis:', err);
    }
  });
  client.on('node error', err => debug('node error', err));
};

function retryStrategy(times) {
  const delay = Math.max(
    times * REDIS_RECONNECTION_BACKOFF_FACTOR,
    REDIS_RECONNECTION_BACKOFF_MINIMUM_TIME
  );

  debug(`retry strategy: try to reconnect ${delay} ms from now`);

  return delay;
}

const createClient = () => {
  let client;
  if (REDIS_CLUSTER_MODE === 'NONE') {
    client = new Redis(
      REDIS_URL,
      merge({}, REDIS_CLIENT_CONFIG, {
        retryStrategy,
      })
    );
  } else if (REDIS_CLUSTER_MODE === 'CLUSTER') {
    client = new Redis.Cluster(
      REDIS_CLUSTER_CONFIGURATION,
      merge(
        {
          scaleReads: 'slave',
        },
        REDIS_CLIENT_CONFIG,
        {
          clusterRetryStrategy: retryStrategy,
        }
      )
    );
  }

  // Attach the monitors that will print debug messages to the console.
  attachMonitors(client);

  return client;
};

module.exports = {
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
  },
};
