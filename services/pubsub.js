const {RedisPubSub} = require('graphql-redis-subscriptions');

const {connectionOptions} = require('./redis');

let pubsub = null;
module.exports = () => {
  if (pubsub) {
    return pubsub;
  }

  pubsub = new RedisPubSub({connection: connectionOptions});

  return pubsub;
};
