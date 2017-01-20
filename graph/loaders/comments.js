const DataLoader = require('dataloader');

const util = require('./util');

const Action = require('../../models/action');
const Comment = require('../../models/comment');

/**
 * Retrieves comments by an array of asset id's.
 * @param {Array} ids array of ids to lookup
 */
const genCommentsByAssetID = (context, ids) => Comment.find({
  asset_id: {
    $in: ids
  },
  parent_id: null,
  status: {
    $in: [null, 'accepted']
  }
}).then(util.arrayJoinBy(ids, 'asset_id'));

/**
 * Retrieves comments by an array of parent ids.
 * @param {Array} ids array of ids to lookup
 */
const genCommentsByParentID = (context, ids) => Comment.find({
  parent_id: {
    $in: ids
  },
  status: {
    $in: [null, 'accepted']
  }
}).then(util.arrayJoinBy(ids, 'parent_id'));

const getCommentsByStatusAndAssetID = (context, {status = null, asset_id = null}) => {

  // TODO: remove when we move the enum over to the uppercase.
  if (status) {
    status = status.toLowerCase();
  }

  return Comment.moderationQueue(status, asset_id);
};

const getCommentsByActionTypeAndAssetID = (context, {action_type, asset_id = null}) => {

  // TODO: remove when we move the enum over to the uppercase.
  if (action_type) {
    action_type = action_type.toLowerCase();
  }

  return Action.find({
    action_type,

    // TODO: remove when we move the enum over to the uppercase.
    item_type: 'comments'
  }).then((actions) => {
    let comments = Comment.find({
      id: {
        $in: actions.map((action) => action.item_id)
      }
    });

    if (asset_id) {
      comments = comments.where({asset_id});
    }

    return comments;
  });
};

const genCommentsByAuthorID = (context, authorIDs) => Comment.find({
  author_id: {
    $in: authorIDs
  }
}).then(util.arrayJoinBy(authorIDs, 'author_id'));

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = (context) => ({
  Comments: {
    getByParentID: new DataLoader((ids) => genCommentsByParentID(context, ids)),
    getByAssetID: new DataLoader((ids) => genCommentsByAssetID(context, ids)),
    getByStatusAndAssetID: (query) => getCommentsByStatusAndAssetID(context, query),
    getByActionTypeAndAssetID: (query) => getCommentsByActionTypeAndAssetID(context, query),
    getByAuthorID: new DataLoader((authorIDs) => genCommentsByAuthorID(context, authorIDs))
  }
});
