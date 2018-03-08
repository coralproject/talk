// TODO: Adjust `RootQuery.asset(id: ID, url: String)` to instead be
// `RootQuery.asset(id: ID, url: String!)` because we'll always need the url, if
// this change is done now everything will likely break on the front end.

const fs = require('fs');
const path = require('path');
const { mergeStrings } = require('gql-merge');
const debug = require('debug')('talk:graph:typeDefs');
const plugins = require('../services/plugins');

/**
 * Plugin support requires us to merge the type definitions from the loaded
 * graphql tags, this gives us the ability to extend any portion of the
 * available graph.
 */
const typeDefs = mergeStrings([
  // Load the core graph definitions from the filesystem.
  fs.readFileSync(path.join(__dirname, 'typeDefs.graphql'), 'utf8'),

  // Load the plugin definitions from the manager.
  ...plugins.get('server', 'typeDefs').map(({ plugin, typeDefs }) => {
    debug(`added plugin '${plugin.name}'`);

    return typeDefs;
  }),
]);

module.exports = typeDefs;
