const loaders = require('./loaders');
const mutators = require('./mutators');

const plugins = require('../services/plugins');
const debug = require('debug')('talk:graph:context');
const Joi = require('joi');

/**
 * Contains the array of plugins that provide context to the server, these top
 * level functions all need the context reference.
 * @type {Array}
 */
const contextPlugins = plugins.get('server', 'context').map(({plugin, context}) => {
  Joi.assert(context, Joi.object().pattern(/\w/, Joi.func().maxArity(1)), `Plugin '${plugin.name}' had an error loading the context`);

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
  constructor({user = null}) {

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
  }
}

module.exports = Context;
