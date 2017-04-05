const schema = require('./schema');
const Context = require('./context');
const plugins = require('../services/plugins');

const {connectionOptions} = require('../services/redis');
const {RedisPubSub} = require('graphql-redis-subscriptions');
const {SubscriptionManager} = require('graphql-subscriptions');
const {SubscriptionServer} = require('subscriptions-transport-ws');
const _ = require('lodash');

const pubsub = new RedisPubSub(connectionOptions);

let setupFunctions = {
  commentAdded: (options, args) => ({
    commentAdded: {
      filter: (comment) => comment.asset_id === args.asset_id
    },
  }),
};

/**
 * Plugin support requires that we merge in existing setupFunctions with our new
 * plugin based ones. This allows plugins to extend existing setupFunctions as well
 * as provide new ones.
 */
setupFunctions = plugins.get('server', 'setupFunctions').reduce((acc, {setupFunctions}) => {
  return _.merge(acc, setupFunctions);
}, setupFunctions);

module.exports = {
  pubsub,
  createGraphOptions: (req) => ({

    // Schema is created already, so just include it.
    schema,

    // Load in the new context here, this'll create the loaders + mutators for
    // the lifespan of this request.
    context: new Context(req, pubsub)
  }),
  createSubscriptionManager: (server, path, sessionFactory) => new SubscriptionServer({
    subscriptionManager: new SubscriptionManager({
      schema,
      pubsub,
      setupFunctions,
    }),
    onSubscribe: (parsedMessage, baseParams, connection) => {

      // Attach the context per request.
      baseParams.context = () => sessionFactory(connection.upgradeReq)
        .then((req) => new Context(req, pubsub))
        .catch((err) => {
          console.error(err);

          return new Context({}, pubsub);
        });

      return baseParams;
    }
  }, {
    server,
    path
  })
};
