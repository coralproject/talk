const express = require('express');
const apollo = require('graphql-server-express');
const tools = require('graphql-tools');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');
const loaders = require('./loaders');
const mutators = require('./mutators');

const schema = tools.makeExecutableSchema({typeDefs, resolvers});
const router = express.Router();

router.use('/ql', apollo.graphqlExpress((req) => {

  let context = {req};

  context.loaders = loaders(context);
  context.mutators = mutators(context);

  return {
    schema,
    context
  };
}));
router.use('/iql', apollo.graphiqlExpress({endpointURL: '/api/v1/graph/ql'}));

module.exports = router;
