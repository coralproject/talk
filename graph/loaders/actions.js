const DataLoader = require('dataloader');
const util = require('./util');
const ActionsService = require('../../services/actions');
const { first, get, remove, groupBy, reduce, defaultTo } = require('lodash');

/**
 * Gets actions based on their item id's.
 */
const genActionsByItemID = (_, item_ids) => {
  return ActionsService.findByItemIdArray(item_ids).then(
    util.arrayJoinBy(item_ids, 'item_id')
  );
};

/**
 * Looks up the actions for each of the items.
 *
 * @param {Object} ctx the graph context of the request
 * @param {Array<String>} itemIDs the items that we need to get the actions for
 */
const genActionsAuthoredWithID = ({ user = {} }, itemIDs) =>
  ActionsService.getUserActions(user.id, itemIDs).then(
    util.arrayJoinBy(itemIDs, 'item_id')
  );

/**
 * Looks up the action summaries for a set of items.
 *
 * @param {Object} ctx the graph context of the request
 * @param {Array<Object>} items the items that should have their items looked up for
 */
const genActionSummariesByItem = async (ctx, items) => {
  const { loaders: { Actions } } = ctx;

  // This is designed to match the action_counts value that is embedded on
  // documents which cache action counts. For users that are not logged in, we
  // don't need to hit the actions collection at all!

  // This will match any action count that is specific for a group id.
  const nonGroupIDTest = /^([A-Z]+)_([A-Z_]+)$/;

  // We will literate over all the items that we're comparing.
  return items.map(async ({ id, action_counts = {} }) => {
    // Cache all those entries for which we got the group id of, because we
    // don't want to include them twice.
    const groupIDCache = {};

    // Possibly get the list of user actions completed by the user. This will be
    // used later to join together with the action summaries to provide context.
    const userActions =
      ctx.user && reduce(action_counts, (total, count) => total + count, 0) > 0
        ? await Actions.getAuthoredByID.load(id)
        : [];

    // Group the user actions in the same way that the action counts are
    // grouped. This will let us extract it easy.
    const groupedUserActions = groupBy(
      userActions,
      ({ action_type, group_id }) =>
        (group_id ? `${action_type}_${group_id}` : action_type).toUpperCase()
    );

    // Generate the action summaries for the item.
    return Object.keys(action_counts)
      .map(action_type => ({
        count: action_counts[action_type],
        action_type: action_type.toUpperCase(),
      }))
      .reduce((actionTypeList, { count, action_type }) => {
        // Get the current user's actions (if they have any).
        const current_user = defaultTo(
          first(get(groupedUserActions, action_type, [])),
          null
        );

        // Check to see if this is a action without a corresponding group id.
        if (nonGroupIDTest.test(action_type)) {
          // This action type does have a group id associated with it.
          const results = nonGroupIDTest.exec(action_type);
          const groupActionType = results[1];
          const groupID = results[2];

          // Purge out the summary if it already exists, and mark that this
          // group id has been found so we don't include it in the future.
          remove(
            actionTypeList,
            ({ action_type }) => action_type === groupActionType
          );
          groupIDCache[groupActionType] = true;

          // Push the new entry in.
          actionTypeList.push({
            action_type: groupActionType,
            group_id: groupID,
            count,
            current_user,
          });
        } else {
          // This does not have a group id. Check to see if this group id
          // already has an specific (group id) entry.
          if (groupIDCache[action_type]) {
            // It does. Don't add anything.
            return actionTypeList;
          }

          // It does not, add the entry.
          actionTypeList.push({
            action_type,
            group_id: null,
            count,
            current_user,
          });
        }

        return actionTypeList;
      }, []);
  });
};

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} ctx the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = ctx => ({
  Actions: {
    getByID: new DataLoader(ids => genActionsByItemID(ctx, ids)),
    getSummariesByItem: new DataLoader(
      items => genActionSummariesByItem(ctx, items),
      { cacheKeyFn: ({ id }) => id }
    ),
    getAuthoredByID: new DataLoader(ids => genActionsAuthoredWithID(ctx, ids)),
  },
});
