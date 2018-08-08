const schema = require('./schema');
const Context = require('./context');
const { createSubscriptionManager } = require('./subscriptions');
const { ENABLE_TRACING, QUERY_DEPTH_LIMIT } = require('../config');
const connectors = require('./connectors');
const depthLimit = require('graphql-depth-limit');

module.exports = {
  createGraphOptions: req => ({
    // Schema is created already, so just include it.
    schema,

    // Load in the new context here, this will create the loaders + mutators for
    // the lifespan of this request.
    context: new Context(req.context),

    // Tracing request options, needed for Apollo Engine.
    tracing: ENABLE_TRACING,
    cacheControl: ENABLE_TRACING,
    validationRules: [ depthLimit(QUERY_DEPTH_LIMIT) ]
  }),
  createSubscriptionManager,
  connectors,
};
