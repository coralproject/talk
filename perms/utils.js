/**
 * check will ensure that the user has the desired roles.
 *
 * @param {Object} user user being checked for roles
 * @param {Array<String>} roles roles to check that the user has
 */
const check = (user, roles) => roles.some(role => role === user.role);

module.exports = {
  check,
};
