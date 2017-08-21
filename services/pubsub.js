const {RedisPubSub} = require('graphql-redis-subscriptions');
const {connectionOptions, attachMonitors} = require('./redis');

/**
 * getClient returns the pubsub singleton for this instance.
 */
let pubsub = null;
const getClient = () => {
  if (pubsub !== null) {
    return pubsub;
  }

  pubsub = new RedisPubSub({connection: connectionOptions});

  // Attach the node monitors to the subscriber + publishers.
  attachMonitors(pubsub.redisPublisher);
  attachMonitors(pubsub.redisSubscriber);

  return pubsub;
};

module.exports = {
  getClient,
};
