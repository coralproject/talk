const loaders = require('./loaders');
const mutators = require('./mutators');
const uuid = require('uuid');
const merge = require('lodash/merge');

const plugins = require('../services/plugins');
const pubsub = require('../services/pubsub');
const debug = require('debug')('talk:graph:context');

/**
 * Contains the array of plugins that provide context to the server, these top
 * level functions all need the context reference.
 * @type {Array}
 */
const contextPlugins = plugins.get('server', 'context').map(({plugin, context}) => {
  debug(`added plugin '${plugin.name}'`);
  return {context};
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
  return merge(...contextPlugins.map((plugin) => {
    return Object.keys(plugin.context).reduce((services, serviceName) => {
      services[serviceName] = plugin.context[serviceName](context);

      return services;
    }, {});
  }));
};

/**
 * Stores the request context.
 */
class Context {
  constructor({user = null}) {

    // Generate a new context id for the request.
    this.id = uuid.v4();

    // Load the current logged in user to `user`, otherwise this'll be null.
    if (user) {
      this.user = user;
    }

    // Create the loaders.
    this.loaders = loaders(this);

    // Create the mutators.
    this.mutators = mutators(this);

    // Decorate the plugin context.
    this.plugins = decorateContextPlugins(this, contextPlugins);

    // Bind the publish/subscribe to the context.
    this.pubsub = pubsub.getClient();
  }
}

module.exports = Context;
