const {RedisPubSub} = require('graphql-redis-subscriptions');

const {connectionOptions} = require('./redis');

module.exports = new RedisPubSub({connection: connectionOptions});
