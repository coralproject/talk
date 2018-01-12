const DataLoader = require('dataloader');
const TagsService = require('../../services/tags');
const plugins = require('../../services/plugins');
const debug = require('debug')('talk:graph:loaders:tags');
const PLUGIN_TAGS = plugins
  .get('server', 'tags')
  .reduce((acc, { plugin, tags }) => {
    debug(`added plugin '${plugin.name}'`);

    acc = acc.concat(tags);

    return acc;
  }, []);

/**
 * Get all the tags for the context for the dataloader.
 */
const genAll = (context, queries) => {
  return Promise.all(
    queries.map(async ({ id, item_type, asset_id }) => {
      let tags = await TagsService.getAll({ id, item_type, asset_id });

      // Merge in the global plugin tags as well.
      tags = tags.concat(PLUGIN_TAGS);

      return tags;
    })
  );
};

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = context => ({
  Tags: {
    getAll: new DataLoader(queries => genAll(context, queries)),
  },
});
