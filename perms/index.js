const constants = require('./constants');
const root = require('./rootReducer');
const queries = require('./queryReducer');
const mutations = require('./mutationReducer');
const subscriptions = require('./subscriptionReducer');

const reducers = [
  root,
  queries,
  mutations,
  subscriptions,
];

// this will make 'reducer' a key in this array. hm.
const allPermissions = Object.keys(constants);

const findGrant = (user, perms) => {

  return perms.every((perm) => {

    for (let key in reducers) {
      const reducer = reducers[key];
      const grant = reducer(user, perm);

      if (grant !== null && typeof grant !== 'undefined') {
        return grant;
      }
    }

    return false;
  });
};

/**
 * returns true, false, or null depending on whether the user has those permissions
 * throws an error if you pass a permission that's not known to the system
 * @param  {User} user          the user making the request for db operations
 * @param  {[type]} context     [description]
 * @param  {String/Array} perms a string an array of strings which are the names of the permissions
 * @return {Boolean}
 */
module.exports = (user, ...perms) => {

  // Make sure all the passed permissions are not typos.
  const missingPerms = perms.filter((perm) => !allPermissions.includes(perm));
  if (missingPerms.length > 0) {
    throw new Error(`${missingPerms.join(' ')} are not valid permissions.`);
  }

  return findGrant(user, perms);
};
