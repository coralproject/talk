const {check} = require('./utils');
const types = require('./constants');

module.exports = (user, perm) => {
  switch (perm) {
  case types.SEARCH_ASSETS:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.SEARCH_OTHER_USERS:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.SEARCH_ACTIONS:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.SEARCH_NON_NULL_OR_ACCEPTED_COMMENTS:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.SEARCH_OTHERS_COMMENTS:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.SEARCH_COMMENT_METRICS:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.LIST_OWN_TOKENS:
    return check(user, ['ADMIN']);
  case types.SEARCH_COMMENT_STATUS_HISTORY:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.VIEW_SUSPENSION_INFO:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.VIEW_PROTECTED_SETTINGS:
    return check(user, ['ADMIN', 'MODERATOR']);
  default:
    break;
  }
};
