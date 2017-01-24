const DataLoader = require('dataloader');

const UserService = require('../../models/user');

const genUserByIDs = (context, ids) => UserService.findByIdArray(ids);

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = (context) => ({
  Users: {
    getByID: new DataLoader((ids) => genUserByIDs(context, ids))
  }
});
