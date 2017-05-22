const {check} = require('./utils');
const types = require('./constants');

module.exports = (user, perm) => {
  switch (perm) {
  case types.CREATE_COMMENT:
    return true;
  case types.CREATE_ACTION:
    return true;
  case types.DELETE_ACTION:
    return true;
  case types.EDIT_NAME:
    return true;
  case types.EDIT_COMMENT:
    return true;
  case types.UPDATE_USER_ROLES:
    return check(user, ['ADMIN']);
  case types.REJECT_USERNAME:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.SET_USER_STATUS:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.SUSPEND_USER:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.SET_COMMENT_STATUS:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.ADD_COMMENT_TAG:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.REMOVE_COMMENT_TAG:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.UPDATE_CONFIG:
    return check(user, ['ADMIN', 'MODERATOR']);
  default:
    break;
  }
};
