const express = require('express');
const apollo = require('graphql-server-express');

const loaders = require('./loaders');
const mutators = require('./mutators');
const schema = require('./schema');

const router = express.Router();

// GraphQL endpoint.
router.use('/ql', apollo.graphqlExpress((req) => {

  let context = {};

  // Load the current logged in user to `user`, otherwise this'll be null.
  context.user = req.user;

  // Create the loaders.
  context.loaders = loaders(context);

  // Create the mutators.
  context.mutators = mutators(context);

  return {
    schema,
    context
  };
}));

// Interactive graphiql interface.
router.use('/iql', apollo.graphiqlExpress({endpointURL: '/api/v1/graph/ql'}));

module.exports = router;
