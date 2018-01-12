const { SharedCounterDataLoader, singleJoinBy } = require('./util');
const DataLoader = require('dataloader');
const {
  SEARCH_NON_NULL_OR_ACCEPTED_COMMENTS,
  SEARCH_OTHERS_COMMENTS,
} = require('../../perms/constants');
const { CACHE_EXPIRY_COMMENT_COUNT } = require('../../config');
const ms = require('ms');
const sc = require('snake-case');

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
          $in: asset_ids,
        },
        status: {
          $in: ['NONE', 'ACCEPTED'],
        },
      },
    },
    {
      $group: {
        _id: '$asset_id',
        count: {
          $sum: 1,
        },
      },
    },
  ])
    .then(singleJoinBy(asset_ids, '_id'))
    .then(results => results.map(result => (result ? result.count : 0)));
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
          $in: asset_ids,
        },
        status: {
          $in: ['NONE', 'ACCEPTED'],
        },
        parent_id: null,
      },
    },
    {
      $group: {
        _id: '$asset_id',
        count: {
          $sum: 1,
        },
      },
    },
  ])
    .then(singleJoinBy(asset_ids, '_id'))
    .then(results => results.map(result => (result ? result.count : 0)));
};

/**
 * Retrieves the count of comments based on the passed in query.
 * @param  {Object} ctx   graph context
 * @param  {Object} query     query to execute against the comments collection
 *                            to compute the counts
 * @return {Promise}          resolves to the counts of the comments from the
 *                            query
 */
const getCommentCountByQuery = (ctx, options) => {
  const {
    statuses,
    asset_id,
    parent_id,
    author_id,
    tags,
    action_type,
  } = options;

  // If user queries for statuses other than NONE and/or ACCEPTED statuses, it needs
  // special privileges.
  if (
    (!statuses ||
      statuses.some(status => !['NONE', 'ACCEPTED'].includes(status))) &&
    (ctx.user == null || !ctx.user.can(SEARCH_NON_NULL_OR_ACCEPTED_COMMENTS))
  ) {
    return null;
  }

  const query = CommentModel.find();

  if (asset_id != null) {
    query.merge({ asset_id });
  }

  if (parent_id !== undefined) {
    query.merge({ parent_id });
  }

  if (author_id) {
    query.merge({ author_id });
  }

  if (ctx.user != null && ctx.user.can(SEARCH_OTHERS_COMMENTS) && action_type) {
    query.merge({
      [`action_counts.${sc(action_type.toLowerCase())}`]: {
        $gt: 0,
      },
    });
  }

  if (statuses && statuses.length > 0) {
    query.merge({ status: { $in: statuses } });
  }

  if (tags && tags.length > 0) {
    query.merge({
      'tags.tag.name': {
        $in: tags,
      },
    });
  }

  return CommentModel.find(query).count();
};

/**
 * getStartCursor will retrieve the start cursor based on the sortBy field.
 *
 * @param {Object} ctx the graph context
 * @param {Object} nodes the result set of retrieved comments
 * @param {Object} params the params from the client describing the query
 */
const getStartCursor = (ctx, nodes, { cursor, sortBy }) => {
  switch (sortBy) {
    case 'CREATED_AT':
      return nodes.length ? nodes[0].created_at : null;
    case 'REPLIES':
      // The cursor is the start! This is using numeric pagination.
      return cursor != null ? cursor : 0;
  }

  const SORT_KEY = sortBy.toLowerCase();
  if (
    !ctx.plugins ||
    !ctx.plugins.Sort.Comments ||
    !ctx.plugins.Sort.Comments[SORT_KEY] ||
    !ctx.plugins.Sort.Comments[SORT_KEY].startCursor
  ) {
    throw new Error(
      `unable to sort by ${sortBy}, no plugin was provided to handle this type`
    );
  }

  return ctx.plugins.Sort.Comments[SORT_KEY].startCursor(ctx, nodes, {
    cursor,
  });
};

/**
 * getEndCursor will fetch the end cursor based on the desired sortBy parameter.
 *
 * @param {Object} ctx the graph context
 * @param {Object} nodes the result set of retrieved comments
 * @param {Object} params the params from the client describing the query
 */
const getEndCursor = (ctx, nodes, { cursor, sortBy }) => {
  switch (sortBy) {
    case 'CREATED_AT':
      return nodes.length ? nodes[nodes.length - 1].created_at : null;
    case 'REPLIES':
      return nodes.length ? (cursor != null ? cursor : 0) + nodes.length : null;
  }

  const SORT_KEY = sortBy.toLowerCase();
  if (
    !ctx.plugins ||
    !ctx.plugins.Sort.Comments ||
    !ctx.plugins.Sort.Comments[SORT_KEY] ||
    !ctx.plugins.Sort.Comments[SORT_KEY].endCursor
  ) {
    throw new Error(
      `unable to sort by ${sortBy}, no plugin was provided to handle this type`
    );
  }

  return ctx.plugins.Sort.Comments[SORT_KEY].endCursor(ctx, nodes, { cursor });
};

/**
 * applySort will add the actual `.sort` and `.skip/.where` clauses to the query
 * to apply the desired sort.
 *
 * @param {Object} ctx the graph context
 * @param {Object} query the current mongoose query object
 * @param {Object} params the params from the client describing the query
 */
const applySort = (ctx, query, { cursor, sortOrder, sortBy }) => {
  switch (sortBy) {
    case 'CREATED_AT': {
      if (cursor) {
        if (sortOrder === 'DESC') {
          query = query.where({
            created_at: {
              $lt: cursor,
            },
          });
        } else {
          query = query.where({
            created_at: {
              $gt: cursor,
            },
          });
        }
      }

      return query.sort({ created_at: sortOrder === 'DESC' ? -1 : 1 });
    }
    case 'REPLIES': {
      if (cursor) {
        query = query.skip(cursor);
      }

      return query.sort({
        reply_count: sortOrder === 'DESC' ? -1 : 1,
        created_at: sortOrder === 'DESC' ? -1 : 1,
      });
    }
  }

  const SORT_KEY = sortBy.toLowerCase();
  if (
    !ctx.plugins ||
    !ctx.plugins.Sort.Comments ||
    !ctx.plugins.Sort.Comments[SORT_KEY] ||
    !ctx.plugins.Sort.Comments[SORT_KEY].sort
  ) {
    throw new Error(
      `unable to sort by ${sortBy}, no plugin was provided to handle this type`
    );
  }

  return ctx.plugins.Sort.Comments[SORT_KEY].sort(ctx, query, {
    cursor,
    sortOrder,
  });
};

/**
 * executeWithSort will actually retrieve the comments based on the pre-assembled
 * query and will compose on top the sort operators necessary to get the desired
 * result.
 *
 * @param {Object} ctx the graph context
 * @param {Object} query the current mongoose query object
 * @param {Object} params the params from the client describing the query
 */
const executeWithSort = async (
  ctx,
  query,
  { cursor, sortOrder, sortBy, limit }
) => {
  // Apply the sort to the query.
  query = applySort(ctx, query, { cursor, sortOrder, sortBy });

  // Apply the limit (if it exists, as it's applied universally).
  if (limit) {
    query = query.limit(limit + 1);
  }

  // Fetch the nodes based on the source query.
  const nodes = await query.exec();

  // The hasNextPage is always handled the same (ask for one more than we need,
  // if there is one more, than there is more).
  let hasNextPage = false;
  if (limit && nodes.length > limit) {
    // There was one more than we expected! Set hasNextPage = true and remove
    // the last item from the array that we requested.
    hasNextPage = true;
    nodes.splice(limit, 1);
  }

  // Use the generator functions below to extract the cursor details based on
  // the current sortBy parameter.
  return {
    startCursor: getStartCursor(ctx, nodes, {
      cursor,
      sortOrder,
      sortBy,
      limit,
    }),
    endCursor: getEndCursor(ctx, nodes, { cursor, sortOrder, sortBy, limit }),
    hasNextPage,
    nodes,
  };
};

/**
 * Retrieves comments based on the passed in query that is filtered by the
 * current used passed in via the context.
 *
 * @param  {Object} context   graph context
 * @param  {Object} query     query terms to apply to the comments query
 */
const getCommentsByQuery = async (
  ctx,
  {
    ids,
    statuses,
    asset_id,
    parent_id,
    author_id,
    limit,
    cursor,
    sortOrder,
    sortBy,
    excludeIgnored,
    tags,
    action_type,
  }
) => {
  let comments = CommentModel.find();

  // If user queries for statuses other than NONE and/or ACCEPTED statuses, it needs
  // special privileges.
  if (
    (!statuses ||
      statuses.some(status => !['NONE', 'ACCEPTED'].includes(status))) &&
    (ctx.user == null || !ctx.user.can(SEARCH_NON_NULL_OR_ACCEPTED_COMMENTS))
  ) {
    return null;
  }

  if (statuses) {
    comments = comments.where({ status: { $in: statuses } });
  }

  if (ctx.user != null && ctx.user.can(SEARCH_OTHERS_COMMENTS) && action_type) {
    comments = comments.where({
      [`action_counts.${sc(action_type.toLowerCase())}`]: {
        $gt: 0,
      },
    });
  }

  if (ids) {
    comments = comments.find({
      id: {
        $in: ids,
      },
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
  if (
    ctx.user &&
    (ctx.user.can(SEARCH_OTHERS_COMMENTS) || ctx.user.id === author_id) &&
    author_id != null
  ) {
    comments = comments.where({ author_id });
  }

  if (asset_id) {
    comments = comments.where({ asset_id });
  }

  // We perform the undefined check because, null, is a valid state for the
  // search to be with, which indicates that it is at depth 0.
  if (parent_id !== undefined) {
    comments = comments.where({ parent_id });
  }

  if (
    excludeIgnored &&
    ctx.user &&
    ctx.user.ignoresUsers &&
    ctx.user.ignoresUsers.length > 0
  ) {
    comments = comments.where({
      author_id: { $nin: ctx.user.ignoresUsers },
    });
  }

  return executeWithSort(ctx, comments, { cursor, sortOrder, sortBy, limit });
};

/**
 * getComments returns the comments by the id's. Only admins can see non-public
 * comments.
 *
 * @param  {Object}        context graph context
 * @param  {Array<String>} ids     the comment id's to fetch
 * @return {Promise}       resolves to the comments
 */
const getComments = ({ user }, ids) => {
  let comments;
  if (user && user.can(SEARCH_OTHERS_COMMENTS)) {
    comments = CommentModel.find({
      id: {
        $in: ids,
      },
    });
  } else {
    comments = CommentModel.find({
      id: {
        $in: ids,
      },
      status: {
        $in: ['NONE', 'ACCEPTED'],
      },
    });
  }
  return comments.then(singleJoinBy(ids, 'id'));
};

/**
 * Creates a set of loaders based on a GraphQL context.
 *
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = context => ({
  Comments: {
    get: new DataLoader(ids => getComments(context, ids)),
    getByQuery: query => getCommentsByQuery(context, query),
    getCountByQuery: query => getCommentCountByQuery(context, query),
    countByAssetID: new SharedCounterDataLoader(
      'Comments.totalCommentCount',
      ms(CACHE_EXPIRY_COMMENT_COUNT),
      ids => getCountsByAssetID(context, ids)
    ),
    parentCountByAssetID: new SharedCounterDataLoader(
      'Comments.countByAssetID',
      ms(CACHE_EXPIRY_COMMENT_COUNT),
      ids => getParentCountsByAssetID(context, ids)
    ),
  },
});
