const fs = require('fs');
const path = require('path');
const { mergeStrings } = require('@coralproject/gql-merge');
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
