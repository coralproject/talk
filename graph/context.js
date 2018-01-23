const loaders = require('./loaders');
const mutators = require('./mutators');
const uuid = require('uuid');
const merge = require('lodash/merge');
const connectors = require('./connectors');

const plugins = require('../services/plugins');
const pubsub = require('../services/pubsub');
const debug = require('debug')('talk:graph:context');

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
  constructor(parent) {
    // Generate a new context id for the request if the parent doesn't provide
    // one.
    this.id = parent.id || uuid.v4();

    // Load the current logged in user to `user`, otherwise this will be null.
    if (parent.user) {
      this.user = parent.user;
    }

    // Attach the connectors.
    this.connectors = connectors;

    // Create the loaders.
    this.loaders = loaders(this);

    // Create the mutators.
    this.mutators = mutators(this);

    // Decorate the plugin context.
    this.plugins = decorateContextPlugins(this, contextPlugins);

    // Bind the publish/subscribe to the context.
    this.pubsub = pubsub.getClient();

    // Bind the parent context.
    this.parent = parent;
  }

  /**
   *
   */
  static forSystem() {
    const { models: { User } } = connectors;

    // Create the system user.
    const user = new User({ system: true });

    return new Context({ user });
  }
}

module.exports = Context;
