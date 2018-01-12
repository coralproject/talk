const constants = require('./constants');
const reducers = require('./reducers');
const constantsArray = Object.keys(constants);

/**
 * findGrant will try to check all the permissions if the user is allowed to do
 * so.
 *
 * @param {Object} user the user being checked whether they have the required
 *                      permissions
 * @param {Array<String>} perms the array of permissions that the user must have
 *                              in order to succeed
 */
const findGrant = (user, perms) =>
  perms.every(perm => {
    for (let key in reducers) {
      const reducer = reducers[key];
      const grant = reducer(user, perm);

      if (typeof grant !== 'undefined' && grant !== null) {
        return grant;
      }
    }

    return false;
  });

/**
 * returns true, false, or null depending on whether the user has those permissions
 * throws an error if you pass a permission that's not known to the system
 * @param  {User} user          the user making the request for db operations
 * @param  {[type]} context     [description]
 * @param  {String/Array} perms a string an array of strings which are the names of the permissions
 * @return {Boolean}
 */
module.exports = (user, ...perms) => {
  if (perms.some(perm => !constantsArray.includes(perm))) {
    const missingPerms = perms.filter(perm => !constantsArray.includes(perm));
    throw new Error(`${missingPerms.join(' ')} are not valid permissions.`);
  }

  return findGrant(user, perms);
};
