const {
  SharedCounterDataLoader,
  singleJoinBy,
} = require('./util');
const DataLoader = require('dataloader');
const {
  SEARCH_NON_NULL_OR_ACCEPTED_COMMENTS,
  SEARCH_OTHERS_COMMENTS
} = require('../../perms/constants');
const {
  CACHE_EXPIRY_COMMENT_COUNT
} = require('../../config');
const ms = require('ms');

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
          $in: ['NONE', 'ACCEPTED']
        }
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
  .then(singleJoinBy(asset_ids, '_id'))
  .then((results) => results.map((result) => result ? result.count : 0));
};

/**
 * Returns the comment count for all comments that are public based on their
 * asset ids.
 * @param {Object}        context     graph context
 * @param {Array<String>} asset_ids   the ids of assets for which there are
 *                                    comments that we want to get
 */
const getParentCountsByAssetID = (context, asset_ids) => {
  return CommentModel.aggregate([
    {
      $match: {
        asset_id: {
          $in: asset_ids
        },
        status: {
          $in: ['NONE', 'ACCEPTED']
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
  .then(singleJoinBy(asset_ids, '_id'))
  .then((results) => results.map((result) => result ? result.count : 0));
};

/**
 * Returns the comment count for all comments that are public based on their
 * parent ids.
 *
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
          $in: ['NONE', 'ACCEPTED']
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
  .then(singleJoinBy(parent_ids, '_id'))
  .then((results) => results.map((result) => result ? result.count : 0));
};

/**
 * Retrieves the count of comments based on the passed in query.
 * @param  {Object} context   graph context
 * @param  {Object} query     query to execute against the comments collection
 *                            to compute the counts
 * @return {Promise}          resolves to the counts of the comments from the
 *                            query
 */
const getCommentCountByQuery = (context, {ids, statuses, asset_id, parent_id, author_id, tags}) => {
  let query = CommentModel.find();

  if (ids) {
    query = query.where({id: {$in: ids}});
  }

  if (statuses) {
    query = query.where({status: {$in: statuses}});
  }

  if (asset_id != null) {
    query = query.where({asset_id});
  }

  if (parent_id !== undefined) {
    query = query.where({parent_id});
  }

  if (author_id) {
    query = query.where({author_id});
  }

  if (tags) {
    query = query.find({
      'tags.tag.name': {
        $in: tags,
      },
    });
  }

  return CommentModel
    .find(query)
    .count();
};

/**
 * Retrieves comments based on the passed in query that is filtered by the
 * current used passed in via the context.
 * @param  {Object} context   graph context
 * @param  {Object} query     query terms to apply to the comments query
 */
const getCommentsByQuery = async ({user}, {ids, statuses, asset_id, parent_id, author_id, limit, cursor, sort, excludeIgnored, tags}) => {
  let comments = CommentModel.find();

  // Only administrators can search for comments with statuses that are not
  // `null`, or `'ACCEPTED'`.
  if (user != null && user.can(SEARCH_NON_NULL_OR_ACCEPTED_COMMENTS) && statuses && statuses.length > 0) {
    comments = comments.where({
      status: {
        $in: statuses
      }
    });
  } else {
    comments = comments.where({
      status: {
        $in: ['NONE', 'ACCEPTED']
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

  if (tags) {
    comments = comments.find({
      'tags.tag.name': {
        $in: tags,
      },
    });
  }

  // Only let an admin request any user or the current user request themself.
  if (user && (user.can(SEARCH_OTHERS_COMMENTS) || user.id === author_id) && author_id != null) {
    comments = comments.where({author_id});
  }

  if (asset_id) {
    comments = comments.where({asset_id});
  }

  // We perform the undefined check because, null, is a valid state for the
  // search to be with, which indicates that it is at depth 0.
  if (parent_id !== undefined) {
    comments = comments.where({parent_id});
  }

  if (excludeIgnored && user && user.ignoresUsers && user.ignoresUsers.length > 0) {
    comments = comments.where({
      author_id: {$nin: user.ignoresUsers}
    });
  }

  if (cursor) {
    if (sort === 'DESC') {
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

  let query = comments
    .sort({created_at: sort === 'DESC' ? -1 : 1});
  if (limit) {
    query = query.limit(limit + 1);
  }
  return query.then((nodes) => {
    let hasNextPage = false;
    if (limit && nodes.length > limit) {
      hasNextPage = true;
      nodes.splice(limit, 1);
    }
    return Promise.resolve({
      startCursor: nodes.length ? nodes[0].created_at : null,
      endCursor: nodes.length ? nodes[nodes.length - 1].created_at : null,
      hasNextPage,
      nodes,
    });
  });
};

/**
 * getComments returns the comments by the id's. Only admins can see non-public comments.
 * @param  {Object}        context graph context
 * @param  {Array<String>} ids     the comment id's to fetch
 * @return {Promise}       resolves to the comments
 */
const getComments = ({user}, ids) => {
  let comments;
  if (user && user.can(SEARCH_OTHERS_COMMENTS)) {
    comments = CommentModel.find({
      id: {
        $in: ids
      }
    });
  } else {
    comments = CommentModel.find({
      id: {
        $in: ids
      },
      status: {
        $in: ['NONE', 'ACCEPTED']
      }
    });
  }
  return comments.then(singleJoinBy(ids, 'id'));
};

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = (context) => ({
  Comments: {
    get: new DataLoader((ids) => getComments(context, ids)),
    getByQuery: (query) => getCommentsByQuery(context, query),
    getCountByQuery: (query) => getCommentCountByQuery(context, query),
    countByAssetID: new SharedCounterDataLoader('Comments.totalCommentCount', ms(CACHE_EXPIRY_COMMENT_COUNT), (ids) => getCountsByAssetID(context, ids)),
    parentCountByAssetID: new SharedCounterDataLoader('Comments.countByAssetID', ms(CACHE_EXPIRY_COMMENT_COUNT), (ids) => getParentCountsByAssetID(context, ids)),
    countByParentID: new SharedCounterDataLoader('Comments.countByParentID', ms(CACHE_EXPIRY_COMMENT_COUNT), (ids) => getCountsByParentID(context, ids)),
  }
});
