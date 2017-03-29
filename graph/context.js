const loaders = require('./loaders');
const mutators = require('./mutators');
const uuid = require('uuid');

const plugins = require('../plugins');
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
 * This should itterate over the passed in plugins and load them all with the
 * current graph context.
 * @return {Object} the saturated plugins object
 */
const decorateContextPlugins = (context, contextPlugins) => contextPlugins.reduce((acc, plugin) => {
  Object.keys(plugin.context).forEach((service) => {
    acc[service] = plugin.context[service](context);
  });

  return acc;
}, {});

/**
 * Stores the request context.
 */
class Context {
  constructor({user = null}, pubsub) {

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
    this.pubsub = pubsub;
  }
}

module.exports = Context;
