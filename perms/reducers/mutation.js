const { get, isString } = require('lodash');
const moment = require('moment');
const { check } = require('../utils');
const types = require('../constants');

module.exports = (user, perm) => {
  switch (perm) {
    case types.CHANGE_PASSWORD:
      // Only users with a local account where they have a password set can
      // actually change their password.
      return (
        user.profiles.some(({ provider }) => provider === 'local') &&
        isString(user.password) &&
        user.password.length > 0
      );

    case types.CHANGE_USERNAME:
      return user.status.username.status === 'REJECTED';

    case types.SET_USERNAME: {
      // Only users who have their usernames rejected or those users who
      // not changed their usernames within 14 days can change their usernames.
      const deadline = moment().subtract(14, 'days');
      return (
        user.status.username.status === 'UNSET' ||
        get(user, 'status.username.history', []).every(({ created_at }) =>
          moment(created_at).isBefore(deadline)
        )
      );
    }

    case types.CREATE_COMMENT:
    case types.CREATE_ACTION:
    case types.DELETE_ACTION:
    case types.EDIT_COMMENT:
      // Anyone can do these things if they aren't suspended, banned, or blocked
      // as they're editing their username.
      return !['UNSET', 'REJECTED', 'CHANGED'].includes(
        user.status.username.status
      );

    case types.ADD_COMMENT_TAG:
    case types.REMOVE_COMMENT_TAG:
      return check(user, ['ADMIN', 'MODERATOR', 'STAFF']);

    case types.SET_COMMENT_STATUS:
    case types.SET_USER_USERNAME_STATUS:
    case types.SET_USER_BAN_STATUS:
    case types.SET_USER_SUSPENSION_STATUS:
    case types.SET_USER_ALWAYS_PREMOD_STATUS:
    case types.UPDATE_ASSET_SETTINGS:
    case types.UPDATE_ASSET_STATUS:
      return check(user, ['ADMIN', 'MODERATOR']);

    case types.UPDATE_CONFIG:
    case types.UPDATE_SETTINGS:
    case types.UPDATE_USER_ROLES:
    case types.CREATE_TOKEN:
    case types.REVOKE_TOKEN:
    case types.DELETE_OTHER_USER:
      return check(user, ['ADMIN']);

    default:
      break;
  }
};
