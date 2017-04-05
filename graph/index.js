const schema = require('./schema');
const Context = require('./context');
const pubsub = require('./pubsub');
const {createSubscriptionManager} = require('./subscriptions');

module.exports = {
  createGraphOptions: (req) => ({

    // Schema is created already, so just include it.
    schema,

    // Load in the new context here, this'll create the loaders + mutators for
    // the lifespan of this request.
    context: new Context(req, pubsub)
  }),
  createSubscriptionManager
};
