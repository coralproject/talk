const DataLoader = require('dataloader');

const util = require('./util');

const ActionsService = require('../../services/actions');
const ActionModel = require('../../models/action');

/**
 * Gets actions based on their item id's.
 */
const genActionsByItemID = (_, item_ids) => {
  return ActionsService.findByItemIdArray(item_ids).then(
    util.arrayJoinBy(item_ids, 'item_id')
  );
};

/**
 * Looks up actions based on the requested id's all bounded by the user.
 * @param  {Object} context the context of the request
 * @param  {Array}  ids     array of id's to get
 * @return {Promise}        resolves to the promises of the requested actions
 */
const genActionSummariessByItemID = ({ user = {} }, item_ids) => {
  return ActionsService.getActionSummaries(item_ids, user.id).then(
    util.arrayJoinBy(item_ids, 'item_id')
  );
};

/**
 * Search for actions based on their action_type and item_type and ensures that
 * the actions returned have unique item id's.
 * @param  {String} action_type the action to search by
 * @param  {String} item_type   the item id to search by
 * @return {Promise}            resolves to distinct items actions
 */
const getItemIdsByActionTypeAndItemType = (_, action_type, item_type) => {
  return ActionModel.distinct('item_id', { action_type, item_type });
};

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = context => ({
  Actions: {
    getByID: new DataLoader(ids => genActionsByItemID(context, ids)),
    getSummariesByItemID: new DataLoader(ids =>
      genActionSummariessByItemID(context, ids)
    ),
    getByTypes: ({ action_type, item_type }) =>
      getItemIdsByActionTypeAndItemType(context, action_type, item_type),
  },
});
