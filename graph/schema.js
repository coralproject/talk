const {
  makeExecutableSchema,
  addResolveFunctionsToSchema,
  addSchemaLevelResolveFunction,
} = require('graphql-tools');
const debug = require('debug')('talk:graph:schema');
const { decorateWithHooks } = require('./hooks');
const { decorateWithErrorHandler } = require('./errorHandler');

const plugins = require('../services/plugins');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

const schema = makeExecutableSchema({ typeDefs });

// Add the resolvers to the schema
addResolveFunctionsToSchema(schema, resolvers);

// Plugin to the schema level resolvers to provide an before/after hook.
decorateWithHooks(schema, plugins.get('server', 'hooks'));

// Handle errors like masking in production and mutation errors.
decorateWithErrorHandler(schema);

// For each schemaLevelResolveFunction, add it to the schema.
plugins
  .get('server', 'schemaLevelResolveFunction')
  .forEach(({ plugin, schemaLevelResolveFunction }) => {
    debug(`added schemaLevelResolveFunction from plugin '${plugin.name}'`);

    addSchemaLevelResolveFunction(schema, schemaLevelResolveFunction);
  });

module.exports = schema;
