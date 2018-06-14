const express = require('express');
const apollo = require('apollo-server-express');
const { createGraphOptions } = require('../../../graph');
const staticTemplate = require('../../../middleware/staticTemplate');
const router = express.Router();

router.use('/ql', apollo.graphqlExpress(createGraphOptions));

// Only include the graphiql tool if we aren't in production mode.
if (process.env.NODE_ENV !== 'production') {
  // Interactive graphiql interface.
  router.use('/iql', staticTemplate, (req, res) => {
    res.render('api/graphiql.njk', {
      endpointURL: 'api/v1/graph/ql',
    });
  });
}

module.exports = router;
