const { check } = require('../utils');
const types = require('../constants');

module.exports = (user, perm) => {
  switch (perm) {
    case types.CHANGE_USERNAME:
      return user.status.username.status === 'REJECTED';

    case types.SET_USERNAME:
      return user.status.username.status === 'UNSET';

    case types.CREATE_COMMENT:
    case types.CREATE_ACTION:
    case types.DELETE_ACTION:
    case types.EDIT_COMMENT:
      // Anyone can do these things if they aren't suspended, banned, or blocked
      // as they're editing their username.
      return !['UNSET', 'REJECTED'].includes(user.status.username.status);

    case types.ADD_COMMENT_TAG:
    case types.REMOVE_COMMENT_TAG:
      return check(user, ['ADMIN', 'MODERATOR', 'STAFF']);

    case types.SET_COMMENT_STATUS:
    case types.SET_USER_USERNAME_STATUS:
    case types.SET_USER_BAN_STATUS:
    case types.SET_USER_SUSPENSION_STATUS:
    case types.UPDATE_ASSET_SETTINGS:
    case types.UPDATE_ASSET_STATUS:
      return check(user, ['ADMIN', 'MODERATOR']);

    case types.UPDATE_CONFIG:
    case types.UPDATE_SETTINGS:
    case types.UPDATE_USER_ROLES:
    case types.CREATE_TOKEN:
    case types.REVOKE_TOKEN:
      return check(user, ['ADMIN']);

    default:
      break;
  }
};
