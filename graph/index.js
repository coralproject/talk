const schema = require('./schema');
const Context = require('./context');

const {connectionOptions} = require('../services/redis');
const {RedisPubSub} = require('graphql-redis-subscriptions');
const {SubscriptionManager} = require('graphql-subscriptions');
const {SubscriptionServer} = require('subscriptions-transport-ws');

const pubsub = new RedisPubSub(connectionOptions);

module.exports = {
  pubsub,
  createGraphOptions: (req) => ({

    // Schema is created already, so just include it.
    schema,

    // Load in the new context here, this'll create the loaders + mutators for
    // the lifespan of this request.
    context: new Context(req, pubsub)
  }),
  createSubscriptionManager: (server, path) => new SubscriptionServer({
    subscriptionManager: new SubscriptionManager({
      schema,
      pubsub,
      setupFunctions: {
        commentAdded: (options, args) => ({
          commentAdded: {
            filter: (comment) => comment.asset_id === args.asset_id
          },
        }),
      }
    }),
    // onConnect: (connectionParams, webSocket) => {
    //   console.log(webSocket.upgradeReq.headers);
    // }
  }, {
    server,
    path
  })
};
