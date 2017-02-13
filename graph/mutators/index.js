const _ = require('lodash');

const Comment = require('./comment');
const Action = require('./action');
const User = require('./user');

module.exports = (context) => {

  // We need to return an object to be accessed.
  return _.merge(...[
    Comment,
    Action,
    User,
  ].map((mutators) => {

    // Each set of mutators is a function which takes the context.
    return mutators(context);
  }));
};
