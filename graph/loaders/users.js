const DataLoader = require('dataloader');

const util = require('./util');

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
const getUsersByQuery = ({user}, {ids, limit, cursor, statuses = null, sortOrder}) => {

  let users = UserModel.find();

  if (ids) {
    users = users.find({
      id: {
        $in: ids
      }
    });
  }

  if (statuses != null) {
    users = users.where({
      status: {
        $in: statuses
      }
    });
  }

  if (cursor) {
    if (sortOrder === 'DESC') {
      users = users.where({
        created_at: {
          $lt: cursor
        }
      });
    } else {
      users = users.where({
        created_at: {
          $gt: cursor
        }
      });
    }
  }

  return users
    .sort({created_at: sortOrder === 'DESC' ? -1 : 1})
    .limit(limit);
};

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = (context) => ({
  Users: {
    getByQuery: (query) => getUsersByQuery(context, query),
    getByID: new DataLoader((ids) => genUserByIDs(context, ids))
  }
});
