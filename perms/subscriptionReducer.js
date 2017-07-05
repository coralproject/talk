const {check} = require('./utils');
const types = require('./constants');

module.exports = (user, perm) => {
  switch (perm) {
  case types.SUBSCRIBE_COMMENT_FLAGGED:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.SUBSCRIBE_COMMENT_ACCEPTED:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.SUBSCRIBE_COMMENT_REJECTED:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.SUBSCRIBE_ALL_COMMENT_EDITED:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.SUBSCRIBE_ALL_COMMENT_ADDED:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.SUBSCRIBE_ALL_USER_SUSPENDED:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.SUBSCRIBE_ALL_USER_BANNED:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.SUBSCRIBE_ALL_USERNAME_REJECTED:
    return check(user, ['ADMIN', 'MODERATOR']);
  default:
    break;
  }
};
