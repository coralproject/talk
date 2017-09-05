const SettingsService = require('../../services/settings');
const {SingletonResolver} = require('./util');

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = () => ({
  Settings: new SingletonResolver(() => SettingsService.retrieve())
});
