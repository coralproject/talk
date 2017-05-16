const intersection = require('lodash/intersection');
const check = (user, roles) => {
  return !!intersection(roles, user.roles).length;
};

module.exports = {
  CREATE_COMMENT: 'CREATE_COMMENT',
  CREATE_ACTION: 'CREATE_ACTION',
  DELETE_ACTION: 'DELETE_ACTION',
  EDIT_NAME: 'EDIT_NAME',
  SET_USER_STATUS: 'SET_USER_STATUS',
  SUSPEND_USER: 'SUSPEND_USER',
  SET_COMMENT_STATUS: 'SET_COMMENT_STATUS',
  ADD_COMMENT_TAG: 'ADD_COMMENT_TAG',
  REMOVE_COMMENT_TAG: 'REMOVE_COMMENT_TAG',
  UPDATE_USER_ROLES: 'UPDATE_USER_ROLES',
  UPDATE_CONFIG: 'UPDATE_CONFIG',
  checkRoles: function (user, perm, context) {
    switch (perm) {
    case this.CREATE_COMMENT:
      return true;
    case this.CREATE_ACTION:
      return true;
    case this.DELETE_ACTION:
      return true;
    case this.EDIT_NAME:
      return true;
    case this.UPDATE_USER_ROLES:
      return check(user, ['ADMIN']);
    case this.SET_USER_STATUS:
      return check(user, ['ADMIN', 'MODERATOR']);
    case this.SUSPEND_USER:
      return check(user, ['ADMIN', 'MODERATOR']);
    case this.SET_COMMENT_STATUS:
      return check(user, ['ADMIN', 'MODERATOR']);
    case this.ADD_COMMENT_TAG:
      return check(user, ['ADMIN', 'MODERATOR']);
    case this.REMOVE_COMMENT_TAG:
      return check(user, ['ADMIN', 'MODERATOR']);
    case this.UPDATE_CONFIG:
      return check(user, ['ADMIN', 'MODERATOR']);
    default:
      break;
    }
  }
};
