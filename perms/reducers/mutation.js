const {check} = require('../utils');
const types = require('../constants');

module.exports = (user, perm) => {
  switch (perm) {
  case types.CREATE_COMMENT:
  case types.CREATE_ACTION:
  case types.DELETE_ACTION:
  case types.EDIT_NAME:
  case types.EDIT_COMMENT:

    // Anyone can do these things if they aren't suspended or banned.
    return true;

  case types.ADD_COMMENT_TAG:
  case types.REMOVE_COMMENT_TAG:
    return check(user, ['ADMIN', 'MODERATOR', 'STAFF']);

  case types.UPDATE_USER_ROLES:
  case types.SET_COMMENT_STATUS:
  case types.SET_USER_USERNAME_STATUS:
  case types.SET_USER_BAN_STATUS:
  case types.SET_USER_SUSPENSION_STATUS:
  case types.UPDATE_CONFIG:
  case types.UPDATE_SETTINGS:
  case types.UPDATE_ASSET_SETTINGS:
  case types.UPDATE_ASSET_STATUS:
    return check(user, ['ADMIN', 'MODERATOR']);

  case types.CREATE_TOKEN:
  case types.REVOKE_TOKEN:
    return check(user, ['ADMIN']);

  default:
    break;
  }
};
