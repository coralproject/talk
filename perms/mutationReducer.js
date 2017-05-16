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
  UPDATE_CONFIG: 'UPDATE_CONFIG',
  reducer: function (user, perm, context, initialState) {
    switch (perm) {
    case 'muation:createComment':
      return true;
    case 'mutation:createAction':
      return true;
    case 'mutation:deleteAction':
      return true;
    case 'mutation:editName':
      return true;
    case 'mutation:setUserStatus':
      return check(user, ['ADMIN', 'MODERATOR']);
    case 'mutation:suspendUser':
      return check(user, ['ADMIN', 'MODERATOR']);
    case 'mutation:setCommentStatus':
      return check(user, ['ADMIN', 'MODERATOR']);
    case 'mutation:addCommentTag':
      return check(user, ['ADMIN', 'MODERATOR']);
    case 'mutation:removeCommentTag':
      return check(user, ['ADMIN', 'MODERATOR']);
    case 'mutation:updateConfig':
      return check(user, ['ADMIN', 'MODERATOR']);
    default:
      return initialState;
    }
  }
};
