const express = require('express');
const apollo = require('graphql-server-express');

const loaders = require('./loaders');
const mutators = require('./mutators');
const schema = require('./schema');

const router = express.Router();

// GraphQL endpoint.
router.use('/ql', apollo.graphqlExpress((req) => {

  let context = {req};

  context.loaders = loaders(context);
  context.mutators = mutators(context);

  return {
    schema,
    context
  };
}));

// Interactive graphiql interface.
router.use('/iql', apollo.graphiqlExpress({endpointURL: '/api/v1/graph/ql'}));

module.exports = router;
