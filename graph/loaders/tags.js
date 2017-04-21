const DataLoader = require('dataloader');

const util = require('./util');

const TagsService = require('../../services/tags');
const TagModel = require('../../models/tag');

/**
 * Gets tags based on their item id's.
 */
const getByItemID = (_, item_ids) => {
  return TagsService
    .findByItemIdArray(item_ids)
    .then(util.arrayJoinBy(item_ids, 'item_id'));
};

/**
 * Search for tags based on their item_type and ensures that
 * the tags returned have unique item id's.
 * @param  {String} item_type   the item id to search by
 * @return {Promise}            resolves to distinct items tags
 */
const getItemIdsByItemType = (_, item_type) => {
  return TagModel.distinct('item_id', {item_type});
};

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = (context) => ({
  Tags: {
    getByID: new DataLoader((ids) => getByItemID(context, ids)),
    getByTypes: ({item_type}) => getItemIdsByItemType(context, item_type)
  }
});
