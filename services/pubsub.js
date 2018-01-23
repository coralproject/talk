const { RedisPubSub } = require('graphql-redis-subscriptions');
const { createClient } = require('./redis');

/**
 * getClient returns the pubsub singleton for this instance.
 */
let pubsub = null;
const getClient = () => {
  if (pubsub !== null) {
    return pubsub;
  }

  // Create the new PubSub client, we only need one per instance of Talk.
  pubsub = new RedisPubSub({
    publisher: createClient(),
    subscriber: createClient(),
  });

  return pubsub;
};

module.exports = {
  getClient,
};
