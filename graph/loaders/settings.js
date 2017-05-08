const SettingsService = require('../../services/settings');
const SettingModel = require('../../models/setting');

const util = require('./util');

/**
 * Search for tags based on their item_type.
 * @param  {String} item_type   the item type to search by
 * @return {Promise}            resolves to distinct items tags
 */
const getByItemType = (_, item_type) => {
  return SettingModel.distinct('tags.models', {item_type});
};

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = (context) => ({
  Settings: {
    get: new util.SingletonResolver(() => SettingsService.retrieve()),
    getTagsByItemType: (item_type) => getByItemType(context, item_type)
  }
});
