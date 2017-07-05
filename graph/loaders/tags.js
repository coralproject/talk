const DataLoader = require('dataloader');
const TagsService = require('../../services/tags');

/**
 * Get all the tags for the context for the dataloader.
 */
const genAll = (context, queries) => {
  return Promise.all(queries.map(({id, item_type, asset_id}) => {
    return TagsService.getAll({id, item_type, asset_id});
  }));
};

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = (context) => ({
  Tags: {
    getAll: new DataLoader((queries) => genAll(context, queries))
  }
});
