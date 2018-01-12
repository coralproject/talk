const _ = require('lodash');
const debug = require('debug')('talk:graph:loaders');

const Actions = require('./actions');
const Assets = require('./assets');
const Comments = require('./comments');
const Settings = require('./settings');
const Tags = require('./tags');
const Users = require('./users');

const plugins = require('../../services/plugins');

let loaders = [
  // Load the core loaders.
  Actions,
  Assets,
  Comments,
  Settings,
  Tags,
  Users,

  // Load the plugin loaders from the manager.
  ...plugins.get('server', 'loaders').map(({ plugin, loaders }) => {
    debug(`added plugin '${plugin.name}'`);

    return loaders;
  }),
];

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = context => {
  // We need to return an object to be accessed.
  return _.merge(
    ...loaders.map(loaders => {
      // Each loader is a function which takes the context.
      return loaders(context);
    })
  );
};
