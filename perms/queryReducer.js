const intersection = require('lodash/intersection');
const check = (user, roles) => {
  return !!intersection(roles, user.roles).length;
};

const SEARCH_ASSETS = 'SEARCH_ASSETS';
const SEARCH_OTHER_USERS = 'SEARCH_OTHER_USERS';
const SEARCH_ACTIONS = 'SEARCH_ACTIONS';
const SEARCH_NON_NULL_OR_ACCEPTED_COMMENTS = 'SEARCH_NON_NULL_OR_ACCEPTED_COMMENTS';
const SEARCH_OTHERS_COMMENTS = 'SEARCH_OTHERS_COMMENTS';
const SEARCH_COMMENT_METRICS = 'SEARCH_COMMENT_METRICS';

module.exports = {
  constants: [
    SEARCH_ASSETS, SEARCH_OTHER_USERS, SEARCH_ACTIONS, SEARCH_NON_NULL_OR_ACCEPTED_COMMENTS,
    SEARCH_OTHERS_COMMENTS, SEARCH_COMMENT_METRICS
  ],
  reducer: (perm, user, context, initialState) => {
    switch (perm) {
    case SEARCH_ASSETS:
      return check(user, ['ADMIN', 'MODERATOR']);
    case SEARCH_OTHER_USERS:
      return check(user, ['ADMIN', 'MODERATOR']);
    case SEARCH_ACTIONS:
      return check(user, ['ADMIN', 'MODERATOR']);
    case SEARCH_NON_NULL_OR_ACCEPTED_COMMENTS:
      return check(user, ['ADMIN', 'MODERATOR']);
    case SEARCH_OTHERS_COMMENTS:
      return check(user, ['ADMIN', 'MODERATOR']);
    case SEARCH_COMMENT_METRICS:
      return check(user, ['ADMIN', 'MODERATOR']);
    default:
      return initialState;
    }
  }
};
