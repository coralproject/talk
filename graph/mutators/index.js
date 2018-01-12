const _ = require('lodash');
const debug = require('debug')('talk:graph:mutators');

const Comment = require('./comment');
const Action = require('./action');
const Asset = require('./asset');
const Settings = require('./settings');
const Tag = require('./tag');
const Token = require('./token');
const User = require('./user');

const plugins = require('../../services/plugins');

let mutators = [
  // Load in the core mutators.
  Comment,
  Action,
  Asset,
  Settings,
  Tag,
  Token,
  User,

  // Load the plugin mutators from the manager.
  ...plugins.get('server', 'mutators').map(({ plugin, mutators }) => {
    debug(`added plugin '${plugin.name}'`);

    return mutators;
  }),
];

/**
 * Creates a set of mutators based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of mutators
 */
module.exports = context => {
  // We need to return an object to be accessed.
  return _.merge(
    ...mutators.map(mutators => {
      // Each set of mutators is a function which takes the context.
      return mutators(context);
    })
  );
};
