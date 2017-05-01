const {SubscriptionManager} = require('graphql-subscriptions');
const {SubscriptionServer} = require('subscriptions-transport-ws');
const _ = require('lodash');

const pubsub = require('./pubsub');
const schema = require('./schema');
const Context = require('./context');
const plugins = require('../services/plugins');

const {deserializeUser} = require('../services/subscriptions');

// Core setup functions
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
