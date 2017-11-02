const mutation = require('./mutation');
const query = require('./query');
const subscription = require('./subscription');

module.exports = [
  (user /* , perm*/) => {

    // If a user is banned or currently suspended, then they aren't allowed to
    // do anything.
    if (user.banned || user.suspended) {
      return false;
    }
  },
  query,
  mutation,
  subscription,
];
