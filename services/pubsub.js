const {RedisPubSub} = require('graphql-redis-subscriptions');

const {connectionOptions} = require('./redis');

let pubsubInstance = null;
module.exports = {
  createClient: () => {
    if (pubsubInstance) {
      return pubsubInstance;
    }

    pubsubInstance = new RedisPubSub({connection: connectionOptions});

    return pubsubInstance;
  }
};
