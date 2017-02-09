const tools = require('graphql-tools');
const maskErrors = require('graphql-errors').maskErrors;

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

const schema = tools.makeExecutableSchema({typeDefs, resolvers});

if (process.env.NODE_ENV === 'production') {

  // Mask errors that are thrown if we are in a production environment.
  maskErrors(schema);
}

module.exports = schema;
