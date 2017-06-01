const {
  SharedCounterDataLoader,
  singleJoinBy,
  arrayJoinBy
} = require('./util');
const DataLoader = require('dataloader');
const {
  SEARCH_NON_NULL_OR_ACCEPTED_COMMENTS,
  SEARCH_OTHERS_COMMENTS
} = require('../../perms/constants');

const CommentModel = require('../../models/comment');
const UsersService = require('../../services/users');

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
 * Returns the count of all public comments on an asset id, also filtering by personalization options.
 *
 * @param {Array<String>} id The ID of the asset
 * @param {Array<String>} excludeIgnored Exclude comments ignored by the requesting user
 */
const getCountsByAssetIDPersonalized = async (context, {assetId, excludeIgnored}) => {
  const query = {
    asset_id: assetId,
    status: {
      $in: ['NONE', 'ACCEPTED'],
    },
  };
  const user = context.user;
  if (excludeIgnored && user) {

    // load afresh, as `user` may be from cache and not have recent ignores
    const freshUser = await UsersService.findById(user.id);
    const ignoredUsers = freshUser.ignoresUsers;
    query.author_id = {$nin: ignoredUsers};
  }
  const count = await CommentModel.where(query).count();
  return count;
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
 * Returns the count of top-level comments on an asset id, also filtering by personalization options.
 *
 * @param {Array<String>} id The ID of the asset
 * @param {Array<String>} excludeIgnored Exclude comments ignored by the requesting user
 */
const getParentCountByAssetIDPersonalized = async (context, {assetId, excludeIgnored}) => {
  const query = {
    asset_id: assetId,
    parent_id: null,
    status: {
      $in: ['NONE', 'ACCEPTED'],
    },
  };
  const user = context.user;
  if (excludeIgnored && user) {

    // load afresh, as `user` may be from cache and not have recent ignores
    const freshUser = await UsersService.findById(user.id);
    const ignoredUsers = freshUser.ignoresUsers;
    query.author_id = {$nin: ignoredUsers};
  }

  return CommentModel.where(query).count();
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
 * Returns the count of comments for the provided parent_id, also filtering by personalization options.
 *
 * @param {Array<String>} id The ID of the parent comment
 * @param {Array<String>} excludeIgnored Exclude comments ignored by context.user
 */
const getCountByParentIDPersonalized = async (context, {id, excludeIgnored}) => {
  const query = {
    parent_id: {
      $in: [id]
    },
    status: {
      $in: ['NONE', 'ACCEPTED']
    }
  };
  const user = context.user;
  if (excludeIgnored && user) {

    // load afresh, as `user` may be from cache and not have recent ignores
    const freshUser = await UsersService.findById(user.id);
    const ignoredUsers = freshUser.ignoresUsers;
    query.author_id = {$nin: ignoredUsers};
  }
  const count = await CommentModel.where(query).count();
  return count;
};

/**
 * Retrieves the count of comments based on the passed in query.
 * @param  {Object} context   graph context
 * @param  {Object} query     query to execute against the comments collection
 *                            to compute the counts
 * @return {Promise}          resolves to the counts of the comments from the
 *                            query
 */
const getCommentCountByQuery = (context, {ids, statuses, asset_id, parent_id, author_id}) => {
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
const getCommentsByQuery = async ({user}, {ids, statuses, asset_id, parent_id, author_id, limit, cursor, sort, excludeIgnored}) => {
  let comments = CommentModel.find();

  // Only administrators can search for comments with statuses that are not
  // `null`, or `'ACCEPTED'`.
  if (user != null && user.can(SEARCH_NON_NULL_OR_ACCEPTED_COMMENTS) && statuses) {
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

  if (excludeIgnored && user && user.ignoresUsers) {
    comments = comments.where({
      author_id: {$nin: user.ignoresUsers}
    });
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

  let query = comments
    .sort({created_at: sort === 'REVERSE_CHRONOLOGICAL' ? -1 : 1});
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
 * Gets the recent replies.
 * @param  {Object}        context   graph context
 * @param  {Array<String>} ids       ids of parent ids
 * @return {Promise}                 resolves to recent replies
 */
const genRecentReplies = (context, ids) => {
  return CommentModel.aggregate([

    // get all the replies for the comments in question
    {$match: {
      parent_id: {
        $in: ids
      }
    }},

    // sort these by their created at timestamp, CHRONOLOGICAL'y as these are
    // replies
    {$sort: {
      created_at: 1
    }},

    // group these replies by their parent_id
    {$group: {
      _id: '$parent_id',
      replies: {
        $push: '$$ROOT'
      }
    }},

    // project it so that we only retain the first 3 replies of each parent
    // comment
    {$project: {
      _id: '$_id',
      replies: {
        $slice: [
          '$replies',
          0,
          3
        ]
      }
    }},

    {$unwind: '$replies'},

  ])
  .then((replies) => replies.map((reply) => reply.replies))
  .then(arrayJoinBy(ids, 'parent_id'));
};

/**
 * Gets the recent comments.
 * @param  {Object}        context   graph context
 * @param  {Array<String>} ids       ids of asset ids
 * @return {Promise}                 resolves to recent comments from assets
 */
const genRecentComments = (_, ids) => {
  return CommentModel.aggregate([

    // get all the replies for the comments in question
    {$match: {
      asset_id: {
        $in: ids
      }
    }},

    // sort these by their created at timestamp, CHRONOLOGICAL'y as these are
    // replies
    {$sort: {
      created_at: 1
    }},

    // group these replies by their parent_id
    {$group: {
      _id: '$asset_id',
      comments: {
        $push: '$$ROOT'
      }
    }},

    // project it so that we only retain the first 3 replies of each parent
    // comment
    {$project: {
      _id: '$_id',
      comments: {
        $slice: [
          '$comments',
          0,
          3
        ]
      }
    }},

    // Unwind these comments.
    {$unwind: '$comments'},

  ])
  .then((replies) => replies.map((reply) => reply.comments))
  .then(arrayJoinBy(ids, 'asset_id'));
};

/**
 * genComments returns the comments by the id's. Only admins can see non-public comments.
 * @param  {Object}        context graph context
 * @param  {Array<String>} ids     the comment id's to fetch
 * @return {Promise}       resolves to the comments
 */
const genComments = ({user}, ids) => {
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
    get: new DataLoader((ids) => genComments(context, ids)),
    getByQuery: (query) => getCommentsByQuery(context, query),
    getCountByQuery: (query) => getCommentCountByQuery(context, query),
    countByAssetID: new SharedCounterDataLoader('Comments.totalCommentCount', 3600, (ids) => getCountsByAssetID(context, ids)),
    countByAssetIDPersonalized: (query) => getCountsByAssetIDPersonalized(context, query),
    parentCountByAssetID: new SharedCounterDataLoader('Comments.countByAssetID', 3600, (ids) => getParentCountsByAssetID(context, ids)),
    parentCountByAssetIDPersonalized: (query) => getParentCountByAssetIDPersonalized(context, query),
    countByParentID: new SharedCounterDataLoader('Comments.countByParentID', 3600, (ids) => getCountsByParentID(context, ids)),
    countByParentIDPersonalized: (query) => getCountByParentIDPersonalized(context, query),
    genRecentReplies: new DataLoader((ids) => genRecentReplies(context, ids)),
    genRecentComments: new DataLoader((ids) => genRecentComments(context, ids))
  }
});
