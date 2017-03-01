const DataLoader = require('dataloader');

const util = require('./util');

const UsersService = require('../../services/users');
const UserModel = require('../../models/user');

const genUserByIDs = (context, ids) => UsersService
  .findByIdArray(ids)
  .then(util.singleJoinBy(ids, 'id'));

/**
 * Retrieves users based on the passed in query that is filtered by the
 * current used passed in via the context.
 * @param  {Object} context   graph context
 * @param  {Object} query     query terms to apply to the users query
 */
const getUsersByQuery = ({user}, {ids, limit, cursor, sort}) => {

  let users = UserModel.find();

  // Only administrators can search for users
  if (user == null || !user.hasRoles('ADMIN')) {
    return null;
  }

  users = users.find();

  if (ids) {
    users = users.find({
      id: {
        $in: ids
      }
    });
  }

  if (cursor) {
    if (sort === 'REVERSE_CHRONOLOGICAL') {
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
    .sort({created_at: sort === 'REVERSE_CHRONOLOGICAL' ? -1 : 1})
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
