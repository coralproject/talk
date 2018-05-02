const Redis = require('ioredis');
const merge = require('lodash/merge');
const {
  REDIS_URL,
  REDIS_RECONNECTION_BACKOFF_FACTOR,
  REDIS_RECONNECTION_BACKOFF_MINIMUM_TIME,
  REDIS_CLIENT_CONFIG,
  REDIS_CLUSTER_MODE,
  REDIS_CLUSTER_CONFIGURATION,
  LOGGING_LEVEL,
} = require('../config');
const { createLogger } = require('./logging');
const logger = createLogger('redis');

const attachMonitors = client => {
  logger.debug('client created');

  // Debug events.
  if (['debug', 'trace'].includes(LOGGING_LEVEL)) {
    client.on('connect', () => logger.info('client connected'));
    client.on('ready', () => logger.debug('client ready'));
    client.on('close', () => logger.debug('client closed the connection'));
    client.on('reconnecting', () =>
      logger.debug('client connection lost, attempting to reconnect')
    );
    client.on('end', () => logger.debug('client ended'));
  }

  // Error events.
  client.on('error', err => {
    if (err) {
      logger.error({ err }, 'cannot connect to redis');
    }
  });
  client.on('node error', err => logger.error({ err }, 'node error'));
};

function retryStrategy(times) {
  const delay = Math.max(
    times * REDIS_RECONNECTION_BACKOFF_FACTOR,
    REDIS_RECONNECTION_BACKOFF_MINIMUM_TIME
  );

  logger.debug(`retry strategy: try to reconnect ${delay} ms from now`);

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
