const { check } = require('../utils');
const types = require('../constants');

module.exports = (user, perm) => {
  switch (perm) {
    case types.SUBSCRIBE_COMMENT_FLAGGED:
    case types.SUBSCRIBE_COMMENT_ACCEPTED:
    case types.SUBSCRIBE_COMMENT_REJECTED:
    case types.SUBSCRIBE_COMMENT_RESET:
    case types.SUBSCRIBE_ALL_COMMENT_EDITED:
    case types.SUBSCRIBE_ALL_COMMENT_ADDED:
    case types.SUBSCRIBE_ALL_USER_SUSPENDED:
    case types.SUBSCRIBE_ALL_USER_BANNED:
    case types.SUBSCRIBE_ALL_USERNAME_REJECTED:
    case types.SUBSCRIBE_ALL_USERNAME_APPROVED:
    case types.SUBSCRIBE_ALL_USERNAME_FLAGGED:
    case types.SUBSCRIBE_ALL_USERNAME_CHANGED:
      return check(user, ['ADMIN', 'MODERATOR']);
    default:
      break;
  }
};
