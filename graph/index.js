const schema = require('./schema');
const Context = require('./context');
const { createSubscriptionManager } = require('./subscriptions');
const { ENABLE_TRACING } = require('../config');

module.exports = {
  createGraphOptions: req => ({
    // Schema is created already, so just include it.
    schema,

    // Load in the new context here, this'll create the loaders + mutators for
    // the lifespan of this request.
    context: new Context(req),

    // Tracing request options, needed for Apollo Engine.
    tracing: ENABLE_TRACING,
    cacheControl: ENABLE_TRACING,
  }),
  createSubscriptionManager,
};
