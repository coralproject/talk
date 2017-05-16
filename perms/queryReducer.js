const intersection = require('lodash/intersection');
const check = (user, roles) => {
  return !!intersection(roles, user.roles).length;
};

module.exports = {
  SEARCH_ASSETS: 'SEARCH_ASSETS',
  SEARCH_OTHER_USERS: 'SEARCH_OTHER_USERS',
  SEARCH_ACTIONS: 'SEARCH_ACTIONS',
  SEARCH_NON_NULL_OR_ACCEPTED_COMMENTS: 'SEARCH_NON_NULL_OR_ACCEPTED_COMMENTS',
  SEARCH_OTHERS_COMMENTS: 'SEARCH_OTHERS_COMMENTS',
  SEARCH_COMMENT_METRICS: 'SEARCH_COMMENT_METRICS',
  reducer: function (perm, user, context, initialState) {
    switch (perm) {
    case this.SEARCH_ASSETS:
      return check(user, ['ADMIN', 'MODERATOR']);
    case this.SEARCH_OTHER_USERS:
      return check(user, ['ADMIN', 'MODERATOR']);
    case this.SEARCH_ACTIONS:
      return check(user, ['ADMIN', 'MODERATOR']);
    case this.SEARCH_NON_NULL_OR_ACCEPTED_COMMENTS:
      return check(user, ['ADMIN', 'MODERATOR']);
    case this.SEARCH_OTHERS_COMMENTS:
      return check(user, ['ADMIN', 'MODERATOR']);
    case this.SEARCH_COMMENT_METRICS:
      return check(user, ['ADMIN', 'MODERATOR']);
    default:
      return initialState;
    }
  }
};
