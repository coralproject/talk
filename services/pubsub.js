const {RedisPubSub} = require('graphql-redis-subscriptions');

const {connectionOptions} = require('./redis');

const createClient = () => new RedisPubSub({connection: connectionOptions});

const createClientFactory = () => {
  let ins = null;
  return () => {
    if (ins) {
      return ins;
    }

    ins = createClient();

    return ins;
  };
};

module.exports = {
  createClient,
  createClientFactory
};
