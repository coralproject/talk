const {
  SUBSCRIBE_COMMENT_ACCEPTED,
  SUBSCRIBE_COMMENT_REJECTED,
  SUBSCRIBE_COMMENT_FLAGGED,
  SUBSCRIBE_ALL_COMMENT_EDITED,
  SUBSCRIBE_ALL_COMMENT_ADDED,
  SUBSCRIBE_ALL_USER_SUSPENDED,
  SUBSCRIBE_ALL_USER_BANNED,
  SUBSCRIBE_ALL_USERNAME_REJECTED,
} = require('../perms/constants');

const merge = require('lodash/merge');
const debug = require('debug')('talk:graph:setupFunctions');
const plugins = require('../services/plugins');

/**
 * Plugin support requires that we merge in existing setupFunctions with our new
 * plugin based ones. This allows plugins to extend existing setupFunctions as well
 * as provide new ones.
 */
const setupFunctions = plugins.get('server', 'setupFunctions').reduce((acc, {plugin, setupFunctions}) => {
  debug(`added plugin '${plugin.name}'`);

  return merge(acc, setupFunctions);
}, {
  commentAdded: (options, args) => ({
    commentAdded: {
      filter: (comment, context) => {
        if (!args.asset_id && (!context.user || !context.user.can(SUBSCRIBE_ALL_COMMENT_ADDED))) {
          return false;
        }
        return !args.asset_id || comment.asset_id === args.asset_id;
      }
    },
  }),
  commentEdited: (options, args) => ({
    commentEdited: {
      filter: (comment, context) => {
        if (!args.asset_id && (!context.user || !context.user.can(SUBSCRIBE_ALL_COMMENT_EDITED))) {
          return false;
        }
        return !args.asset_id || comment.asset_id === args.asset_id;
      }
    },
  }),
  commentFlagged: (options, args) => ({
    commentFlagged: {
      filter: (comment, context) => {
        if (!context.user || !context.user.can(SUBSCRIBE_COMMENT_FLAGGED)) {
          return false;
        }
        return !args.asset_id || comment.asset_id === args.asset_id;
      }
    },
  }),
  commentAccepted: (options, args) => ({
    commentAccepted: {
      filter: (comment, context) => {
        if (!context.user || !context.user.can(SUBSCRIBE_COMMENT_ACCEPTED)) {
          return false;
        }
        return !args.asset_id || comment.asset_id === args.asset_id;
      }
    },
  }),
  commentRejected: (options, args) => ({
    commentRejected: {
      filter: (comment, context) => {
        if (!context.user || !context.user.can(SUBSCRIBE_COMMENT_REJECTED)) {
          return false;
        }
        return !args.asset_id || comment.asset_id === args.asset_id;
      }
    },
  }),
  userSuspended: (options, args) => ({
    userSuspended: {
      filter: (user, context) => {
        if (
          !context.user
          || args.user_id !== user.id && !context.user.can(SUBSCRIBE_ALL_USER_SUSPENDED)
        ) {
          return false;
        }
        return !args.user_id || user.id === args.user_id;
      }
    },
  }),
  userBanned: (options, args) => ({
    userBanned: {
      filter: (user, context) => {
        if (
          !context.user
          || args.user_id !== user.id && !context.user.can(SUBSCRIBE_ALL_USER_BANNED)
        ) {
          return false;
        }
        return !args.user_id || user.id === args.user_id;
      }
    },
  }),
  usernameRejected: (options, args) => ({
    usernameRejected: {
      filter: (user, context) => {
        if (
          !context.user
          || args.user_id !== user.id && !context.user.can(SUBSCRIBE_ALL_USERNAME_REJECTED)
        ) {
          return false;
        }
        return !args.user_id || user.id === args.user_id;
      }
    },
  }),
});

module.exports = setupFunctions;
