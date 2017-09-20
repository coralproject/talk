const DataLoader = require('dataloader');

const util = require('./util');
const union = require('lodash/union');

const {
  SEARCH_OTHER_USERS,
} = require('../../perms/constants');

const UsersService = require('../../services/users');
const UserModel = require('../../models/user');

const genUserByIDs = async (context, ids) => {
  if (!ids || ids.length === 0) {
    return [];
  }

  if (ids.length === 1) {
    const user = await UsersService.findById(ids[0]);
    return [user];
  }

  return UsersService
    .findByIdArray(ids)
    .then(util.singleJoinBy(ids, 'id'));
};

/**
 * Retrieves users based on the passed in query that is filtered by the
 * current used passed in via the context.
 * @param  {Object} context   graph context
 * @param  {Object} query     query terms to apply to the users query
 */
const getUsersByQuery = async ({user, loaders: {Actions}}, {ids, limit, cursor, statuses, action_type, sortOrder}) => {
  let query = UserModel.find();

  if (action_type || statuses) {
    if (!user || !user.can(SEARCH_OTHER_USERS)) {
      return null;
    }

    if (statuses) {
      query = query.where({
        status: {
          $in: statuses
        }
      });
    } else {
      const userIds = await Actions.getByTypes({action_type, item_type: 'USERS'});
      ids = ids ? union(ids, userIds) : userIds;
    }
  }

  if (ids) {
    query = query.find({
      id: {
        $in: ids
      }
    });
  }

  if (cursor) {
    if (sortOrder === 'DESC') {
      query = query.where({
        created_at: {
          $lt: cursor
        }
      });
    } else {
      query = query.where({
        created_at: {
          $gt: cursor
        }
      });
    }
  }

  // Apply the limit.
  if (limit) {
    query = query.limit(limit + 1);
  }

  // Sort by created_at.
  query.sort({created_at: sortOrder === 'DESC' ? -1 : 1});

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

  const startCursor = nodes.length ? nodes[0].created_at : null;
  const endCursor = nodes.length ? nodes[nodes.length - 1].created_at : null;

  return {
    startCursor,
    endCursor,
    hasNextPage,
    nodes,
  };
};

/**
 * Retrieves the count of users based on the passed in query.
 * @param  {Object} context   graph context
 * @param  {Object} query     query to execute against the users collection
 *                            to compute the counts
 * @return {Promise}          resolves to the counts of the users from the
 *                            query
 */
const getCountByQuery = async ({loaders: {Actions}}, {action_type, statuses}) => {
  let query = UserModel.find();

  if (action_type) {
    const userIds = await Actions.getByTypes({action_type, item_type: 'USERS'});

    query = query.find({
      id: {
        $in: userIds
      }
    });
  }

  if (statuses) {
    query = query.where({
      status: {
        $in: statuses
      }
    });
  }

  return UserModel
    .find(query)
    .count();
};

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = (context) => ({
  Users: {
    getByQuery: (query) => getUsersByQuery(context, query),
    getByID: new DataLoader((ids) => genUserByIDs(context, ids)),
    getCountByQuery: (query) => getCountByQuery(context, query)
  }
});
