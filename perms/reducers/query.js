const { check } = require('../utils');
const types = require('../constants');

module.exports = (user, perm) => {
  switch (perm) {
    case types.SEARCH_ASSETS:
    case types.SEARCH_OTHER_USERS:
    case types.SEARCH_ACTIONS:
    case types.SEARCH_NON_NULL_OR_ACCEPTED_COMMENTS:
    case types.SEARCH_OTHERS_COMMENTS:
    case types.SEARCH_COMMENT_STATUS_HISTORY:
    case types.VIEW_USER_STATUS:
    case types.VIEW_PROTECTED_SETTINGS:
    case types.VIEW_USER_ROLE:
    case types.VIEW_USER_EMAIL:
    case types.VIEW_BODY_HISTORY:
    case types.VIEW_COMMENT_DELETED_AT:
      return check(user, ['ADMIN', 'MODERATOR']);
    case types.LIST_OWN_TOKENS:
      return check(user, ['ADMIN']);
    default:
      break;
  }
};
