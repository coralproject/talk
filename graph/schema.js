const {makeExecutableSchema} = require('graphql-tools');
const {decorateWithHooks} = require('./hooks');
const {decorateWithErrorHandler} = require('./errorHandler');

const plugins = require('../services/plugins');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

const schema = makeExecutableSchema({typeDefs, resolvers});

// Plugin to the schema level resolvers to provide an before/after hook.
decorateWithHooks(schema, plugins.get('server', 'hooks'));

// Handle errors like masking in production and mutation errors.
decorateWithErrorHandler(schema);

module.exports = schema;
