const {makeExecutableSchema} = require('graphql-tools');
const {maskErrors} = require('graphql-errors');
const {decorateWithHooks} = require('./hooks');

const plugins = require('../services/plugins');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

const schema = makeExecutableSchema({typeDefs, resolvers});

// Plugin to the schema level resolvers to provide an before/after hook.
decorateWithHooks(schema, plugins.get('server', 'hooks'));

// If we are in production mode, don't show server errors to the front end.
if (process.env.NODE_ENV === 'production') {

  // Mask errors that are thrown if we are in a production environment.
  maskErrors(schema);
}

module.exports = schema;
