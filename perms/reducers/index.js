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
  user => {
    // System users can do everything!
    if (user.system === true) {
      return true;
    }
  },
  query,
  mutation,
  subscription,
];
