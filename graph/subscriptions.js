const {SubscriptionManager} = require('graphql-subscriptions');
const {SubscriptionServer} = require('subscriptions-transport-ws');
const _ = require('lodash');
const debug = require('debug')('talk:graph:subscriptions');

const pubsub = require('./pubsub');
const schema = require('./schema');
const Context = require('./context');
const plugins = require('../services/plugins');

const {deserializeUser} = require('../services/subscriptions');

/**
 * Plugin support requires that we merge in existing setupFunctions with our new
 * plugin based ones. This allows plugins to extend existing setupFunctions as well
 * as provide new ones.
 */
const setupFunctions = plugins.get('server', 'setupFunctions').reduce((acc, {plugin, setupFunctions}) => {
  debug(`added plugin '${plugin.name}'`);

  return _.merge(acc, setupFunctions);
}, {
  commentAdded: (options, args) => ({
    commentAdded: {
      filter: (comment) => comment.asset_id === args.asset_id
    },
  }),
  commentEdited: (options, args) => ({
    commentEdited: {
      filter: (comment) => comment.asset_id === args.asset_id
    },
  }),
});

/**
 * This creates a new subscription manager.
 */
const createSubscriptionManager = (server) => new SubscriptionServer({
  subscriptionManager: new SubscriptionManager({
    schema,
    pubsub,
    setupFunctions,
  }),
  onSubscribe: (parsedMessage, baseParams, connection) => {

    // Attach the context per request.
    baseParams.context = () => deserializeUser(connection.upgradeReq)
      .then((req) => new Context(req, pubsub))
      .catch((err) => {
        console.error(err);

        return new Context({}, pubsub);
      });

    return baseParams;
  }
}, {
  server,
  path: '/api/v1/live'
});

module.exports = {
  createSubscriptionManager
};
