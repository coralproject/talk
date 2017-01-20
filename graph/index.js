const loaders = require('./loaders');
const mutators = require('./mutators');
const schema = require('./schema');

module.exports = {
  createGraphOptions: (req) => {

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
  }
};
