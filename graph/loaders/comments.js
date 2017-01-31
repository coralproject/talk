const util = require('./util');

const CommentModel = require('../../models/comment');

/**
 * Returns the comment count for all comments that are public based on their
 * asset ids.
 * @param {Object}        context     graph context
 * @param {Array<String>} asset_ids   the ids of assets for which there are
 *                                    comments that we want to get
 */
const getCountsByAssetID = (context, asset_ids) => {
  return CommentModel.aggregate([
    {
      $match: {
        asset_id: {
          $in: asset_ids
        },
        status: {
          $in: [null, 'ACCEPTED']
        },
        parent_id: null
      }
    },
    {
      $group: {
        _id: '$asset_id',
        count: {
          $sum: 1
        }
      }
    }
  ])
  .then(util.singleJoinBy(asset_ids, '_id'))
  .then((results) => results.map((result) => result ? result.count : 0));
};

/**
 * Returns the comment count for all comments that are public based on their
 * parent ids.
 * @param {Object}        context     graph context
 * @param {Array<String>} parent_ids  the ids of parents for which there are
 *                                    comments that we want to get
 */
const getCountsByParentID = (context, parent_ids) => {
  return CommentModel.aggregate([
    {
      $match: {
        parent_id: {
          $in: parent_ids
        },
        status: {
          $in: [null, 'ACCEPTED']
        }
      }
    },
    {
      $group: {
        _id: '$parent_id',
        count: {
          $sum: 1
        }
      }
    }
  ])
  .then(util.singleJoinBy(parent_ids, '_id'))
  .then((results) => results.map((result) => result ? result.count : 0));
};

/**
 * Retrieves comments based on the passed in query that is filtered by the
 * current used passed in via the context.
 * @param  {Object} context   graph context
 * @param  {Object} query     query terms to apply to the comments query
 */
const getCommentsByQuery = ({user}, {ids, statuses, asset_id, parent_id, limit, cursor, sort}) => {
  let comments = CommentModel.find();

  // Only administrators can search for comments with statuses that are not
  // `null`, or `'ACCEPTED'`.
  if (user != null && user.hasRoles('ADMIN') && statuses) {
    comments = comments.where({
      status: {
        $in: statuses
      }
    });
  } else {
    comments = comments.where({
      status: {
        $in: [null, 'ACCEPTED']
      }
    });
  }

  if (ids) {
    comments = comments.find({
      id: {
        $in: ids
      }
    });
  }

  if (asset_id) {
    comments = comments.where({asset_id});
  }

  // We perform the undefined check because, null, is a valid state for the
  // search to be with, which indicates that it is at depth 0.
  if (parent_id !== undefined) {
    comments = comments.where({parent_id});
  }

  if (cursor) {
    if (sort === 'REVERSE_CHRONOLOGICAL') {
      comments = comments.where({
        created_at: {
          $lt: cursor
        }
      });
    } else {
      comments = comments.where({
        created_at: {
          $gt: cursor
        }
      });
    }
  }

  return comments
    .sort({created_at: sort === 'REVERSE_CHRONOLOGICAL' ? -1 : 1})
    .limit(limit);
};

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = (context) => ({
  Comments: {
    getByQuery: (query) => getCommentsByQuery(context, query),
    countByAssetID: new util.SharedCacheDataLoader('Comments.countByAssetID', 3600, (ids) => getCountsByAssetID(context, ids)),
    countByParentID: new util.SharedCacheDataLoader('Comments.countByParentID', 3600, (ids) => getCountsByParentID(context, ids))
  }
});
