const {RedisPubSub} = require('graphql-redis-subscriptions');

const {connectionOptions} = require('../services/redis');

module.exports = new RedisPubSub({connection: connectionOptions});
