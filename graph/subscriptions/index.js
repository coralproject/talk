const { SubscriptionManager } = require('graphql-subscriptions');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const debug = require('debug')('talk:graph:subscriptions');
const DataLoader = require('dataloader');

const { getPubsub } = require('./pubsub');
const schema = require('../schema');
const Context = require('../context');
const plugins = require('../../services/plugins');
const User = require('../../models/user');
const { singleJoinBy } = require('../loaders/util');

const { deserializeUser } = require('../../services/subscriptions');
const setupFunctions = require('./setupFunctions');

const ms = require('ms');
const { KEEP_ALIVE } = require('../../config');

const { BASE_PATH } = require('../../url');

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

  try {
    // Pull the user off of the upgrade request.
    const hydratedRequest = await deserializeUser(connection.upgradeReq);

    // Update the connections upgrade request, as we'll use that to verify that
    // the user is allowed each operation.
    connection.upgradeReq = hydratedRequest;
  } catch (err) {
    console.error(err);
  }

  // Call all the hooks.
  await Promise.all(
    hooks.onConnect.map(hook => hook(connectionParams, connection))
  );
};

/**
 * batchedUserRefresher will get users based on ID for websocket user refresh
 * operations to reduce load related to user refreshing.
 */
const batchedUserRefresher = new DataLoader(
  userIDs => {
    debug(`OPERATION: refreshing ${userIDs.length} users.`);
    return User.find({ id: { $in: userIDs } }).then(
      singleJoinBy(userIDs, 'id')
    );
  },
  {
    // Disable the cache, as this dataloader is long lived, and the point of
    // using this dataloader is to batch refetch operations rather than caching
    // then as we normally would.
    cache: false,
  }
);

const contextGenerator = req => {
  // Pull the user(?) off the request.
  const { user, jwt } = req;

  if (!user || !jwt) {
    // There is no valid user on the request, let it continue as is then.
    return async () => new Context(req);
  }

  // Provide a flag that can be used to short circuit invalid requests.
  let expiredLogin = false;

  async function refreshUser() {
    // Check to see if this request has been short circuited.
    if (expiredLogin) {
      // It has, let's exit here.
      return null;
    }

    // Validate that the JWT for this user has not expired.
    const { exp = false } = jwt;
    if (exp && exp < Date.now() / 1000) {
      // Mark that this token has expired, don't bother performing this syscall
      // again to check the time.
      expiredLogin = true;
      return null;
    }

    try {
      // Let's refresh the user from the database, as they may have changed.
      const refreshedUser = await batchedUserRefresher.load(user.id);
      if (!refreshedUser) {
        return null;
      }

      return refreshedUser;
    } catch (err) {
      return null;
    }
  }

  // Return the context builder function that'll use the passed context to
  // generate future contexts.
  return async () => {
    // Refresh the user (potentially null).
    const refreshedUser = await refreshUser();

    // Attach the refreshedUser to the request.
    req.user = refreshedUser;

    // Return the new context.
    return new Context(req);
  };
};

const onOperation = async (parsedMessage, baseParams, connection) => {
  // Pull the upgrade request off of the connection.
  const upgradeReq = connection.upgradeReq;

  // Attach the context handler to the request.
  baseParams.context = contextGenerator(upgradeReq);

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
        pubsub: getPubsub(),
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
