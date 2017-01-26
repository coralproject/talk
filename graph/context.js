const loaders = require('./loaders');
const mutators = require('./mutators');

/**
 * Stores the request context.
 */
class Context {
  constructor({user = null}) {

    // Load the current logged in user to `user`, otherwise this'll be null.
    if (user) {
      this.user = user;
    }

    // Create the loaders.
    this.loaders = loaders(this);

    // Create the mutators.
    this.mutators = mutators(this);
  }
}

module.exports = Context;
