const tools = require('graphql-tools');

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

const schema = tools.makeExecutableSchema({typeDefs, resolvers});

module.exports = schema;
