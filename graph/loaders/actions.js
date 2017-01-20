const DataLoader = require('dataloader');

const util = require('./util');

const Action = require('../../models/action');

/**
 * Looks up actions based on the requested id's all bounded by the user.
 * @param  {Object} context the context of the request
 * @param  {Array}  ids     array of id's to get
 * @return {Promise}        resolves to the promises of the requested actions
 */
const genActionSummariessByItemID = ({user = {}}, item_ids) => {
  return Action.getActionSummaries(item_ids, user.id)
    .then(util.arrayJoinBy(item_ids, 'item_id'));
};

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = (context) => ({
  Actions: {
    getByItemID: new DataLoader((ids) => genActionSummariessByItemID(context, ids)),
  }
});
