const { RedisPubSub } = require('graphql-redis-subscriptions');
const { createClient: createRedisClient } = require('../../services/redis');
const debug = require('debug')('talk:graph:subscriptions:pubsub');

/**
 * getPubsub returns the pubsub singleton for this instance.
 */
let pubsub = null;
const getPubsub = () => {
  if (pubsub !== null) {
    return pubsub;
  }

  // Create the publisher and subscriber redis clients.
  const publisher = createRedisClient();
  const subscriber = createRedisClient();

  // Create the new PubSub client, we only need one per instance of Talk.
  pubsub = new RedisPubSub({
    publisher,
    subscriber,
  });

  debug('created');

  return pubsub;
};

module.exports.getPubsub = getPubsub;
