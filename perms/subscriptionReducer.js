const {check} = require('./utils');
const types = require('./constants');

module.exports = (user, perm) => {
  switch (perm) {
  case types.SUBSCRIBE_COMMENT_STATUS:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.SUBSCRIBE_ALL_COMMENT_EDITS:
    return check(user, ['ADMIN', 'MODERATOR']);
  case types.SUBSCRIBE_ALL_COMMENT_FLAGS:
    return check(user, ['ADMIN', 'MODERATOR']);
  default:
    break;
  }
};
