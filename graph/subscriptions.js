const { SubscriptionManager } = require('graphql-subscriptions');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const debug = require('debug')('talk:graph:subscriptions');

const pubsub = require('../services/pubsub');
const schema = require('./schema');
const Context = require('./context');
const plugins = require('../services/plugins');

const { deserializeUser } = require('../services/subscriptions');
const setupFunctions = require('./setupFunctions');

const ms = require('ms');
const { KEEP_ALIVE } = require('../config');

const { BASE_PATH } = require('../url');

// Collect all the plugin hooks that should be executed onConnect and
// onDisconnect.
const hooks = plugins
  .get('server', 'websockets')
  .map(({ plugin, websockets }) => {
    debug(
      `added websocket hooks ${Object.keys(websockets)} from plugin '${
        plugin.name
      }'`
    );

    return websockets;
  })
  .reduce(
    (hooks, { onConnect = null, onDisconnect = null }) => {
      if (onConnect) {
        hooks.onConnect.push(onConnect);
      }

      if (onDisconnect) {
        hooks.onDisconnect.push(onDisconnect);
      }

      return hooks;
    },
    {
      onConnect: [],
      onDisconnect: [],
    }
  );

const onConnect = async (connectionParams, connection) => {
  // Attach the token from the connection options if it was provided.
  if (connectionParams.token) {
    debug(
      'token sent via onConnect, attaching to the headers of the upgrade request'
    );

    // Attach it to the upgrade request.
    connection.upgradeReq.headers['authorization'] = `Bearer ${
      connectionParams.token
    }`;
  }

  // Call all the hooks.
  await Promise.all(
    hooks.onConnect.map(hook => hook(connectionParams, connection))
  );
};

const onOperation = (parsedMessage, baseParams, connection) => {
  // Cache the upgrade request.
  let upgradeReq = connection.upgradeReq;

  // Attach the context per request.
  baseParams.context = async () => {
    let req;

    try {
      req = await deserializeUser(upgradeReq);
      debug(`user ${req.user ? 'was' : 'was not'} on websocket request`);
    } catch (e) {
      console.error(e);

      return new Context({});
    }

    return new Context(req);
  };

  return baseParams;
};

const onDisconnect = connection =>
  Promise.all(hooks.onDisconnect.map(hook => hook(connection)));

/**
 * This creates a new subscription manager.
 */
const createSubscriptionManager = server =>
  new SubscriptionServer(
    {
      subscriptionManager: new SubscriptionManager({
        schema,
        pubsub: pubsub.getClient(),
        setupFunctions,
      }),
      onConnect,
      onDisconnect,
      onOperation,
      keepAlive: ms(KEEP_ALIVE),
    },
    {
      server,
      path: `${BASE_PATH}api/v1/live`,
    }
  );

module.exports = {
  createSubscriptionManager,
};
