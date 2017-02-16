const _ = require('lodash');

const Actions = require('./actions');
const Assets = require('./assets');
const Comments = require('./comments');
const Metrics = require('./metrics');
const Settings = require('./settings');
const Users = require('./users');

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = (context) => {

  // We need to return an object to be accessed.
  return _.merge(...[
    Actions,
    Assets,
    Comments,
    Metrics,
    Settings,
    Users
  ].map((loaders) => {

    // Each loader is a function which takes the context.
    return loaders(context);
  }));
};
