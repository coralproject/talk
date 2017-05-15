const root = require('./rootReducer');
const queries = require('./queryReducer');
const mutations = require('./mutationReducer');

const reducers = [
  root.reducer,
  queries.reducer,
  mutations.reducer
];

const allPermissions = [...root.constants, ...queries.constants, ...mutations.constants];

const findGrant = (user, perms, context, initialState) => {
  return perms.every(perm => {

    for (let reducer in reducers) {
      const grant = reducer(user, perm, context, initialState);

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
module.exports = (user, context, ...perms) => {

  // make sure all the passed permissions are not typos
  const missingPerms = perms.filter(perm => {
    return typeof allPermissions[perm] === 'undefined';
  });

  if (missingPerms.length) {
    throw new Error(`${missingPerms.join(' ')} are not valid permissions.`);
  }

  return findGrant(user, perms, context, null);
};
