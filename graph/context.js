const loaders = require('./loaders');
const mutators = require('./mutators');
const uuid = require('uuid/v4');
const connectors = require('./connectors');
const { get, merge } = require('lodash');
const plugins = require('../services/plugins');
const { getBroker } = require('./subscriptions/broker');
const debug = require('debug')('talk:graph:context');
const { createLogger } = require('../services/logging');
const { graphql } = require('graphql');

/**
 * Contains the array of plugins that provide context to the server, these top
 * level functions all need the context reference.
 * @type {Array}
 */
const contextPlugins = plugins
  .get('server', 'context')
  .map(({ plugin, context }) => {
    debug(`added plugin '${plugin.name}'`);
    return { context };
  });

/**
 * This should iterate over the passed in plugins and load them all with the
 * current graph context.
 * @return {Object} the saturated plugins object
 */
const decorateContextPlugins = (context, contextPlugins) => {
  // For each of the plugins, we execute with the context to get the context
  // based plugin. We then merge that into an object for the plugin. Once the
  // plugin is assembled, we merge that object with all the other objects
  // provided from the other plugins.
  return merge(
    ...contextPlugins.map(plugin => {
      return Object.keys(plugin.context).reduce((services, serviceName) => {
        services[serviceName] = plugin.context[serviceName](context);

        return services;
      }, {});
    })
  );
};

/**
 * Stores the request context.
 */
class Context {
  constructor(ctx) {
    // Generate a new context id for the request if the parent doesn't provide
    // one.
    this.id = ctx.id || uuid.v4();

    // Attach a logger or create one.
    this.log = ctx.log || createLogger('context', this.id);

    // Load the current logged in user to `user`, otherwise this will be null.
    this.user = get(ctx, 'user');

    // Attach the connectors.
    this.connectors = connectors;

    // Create the loaders.
    this.loaders = loaders(this);

    // Create the mutators.
    this.mutators = mutators(this);

    // Decorate the plugin context.
    this.plugins = decorateContextPlugins(this, contextPlugins);

    // Bind the publish/subscribe to the context.
    this.pubsub = getBroker();

    // Bind the parent context.
    this.parent = ctx;
  }

  /**
   * graphql will execute a graph request for the current context.
   *
   * @param {String} requestString  A GraphQL language formatted string
   *    representing the requested operation.
   * @param {Object} variableValues  A mapping of variable name to runtime value
   *    to use for all variables defined in the requestString.
   * @param {Object} rootValue The value provided as the first argument to
   *    resolver functions on the top level type (e.g. the query object type).
   * @param {String} operationName The name of the operation to use if
   *    requestString contains multiple possible operations. Can be omitted if
   *    requestString contains only one operation.
   * @returns {Promise}
   */
  async graphql(
    requestString,
    variableValues = {},
    rootValue = {},
    operationName = undefined
  ) {
    // Perform the graph request directly using the graphql client.
    return graphql(
      // Use the connected graph schema.
      this.connectors.graph.schema,
      requestString,
      rootValue,
      // Use this, the context as the context.
      this,
      variableValues,
      operationName
    );
  }

  /**
   * forSystem returns a system context object that can be used for internal
   * operations.
   */
  static forSystem() {
    const { models: { User } } = connectors;

    // Create the system user.
    const user = new User({ system: true });

    return new Context({ user });
  }
}

// Attach the Context to the connectors.
connectors.graph.Context = Context;

// Connect the connect based plugins after the server has started.
plugins.defer('server', 'connect', ({ plugin, connect }) => {
  debug(`connecting plugin to connectors '${plugin.name}'`);

  // Pass the connectors down to the connect plugin.
  connect(connectors);
});

module.exports = Context;
