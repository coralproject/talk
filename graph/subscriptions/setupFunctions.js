const {
  SUBSCRIBE_ALL_COMMENT_ADDED,
  SUBSCRIBE_ALL_COMMENT_EDITED,
  SUBSCRIBE_ALL_USER_BANNED,
  SUBSCRIBE_ALL_USER_CREATED,
  SUBSCRIBE_ALL_USER_SUSPENDED,
  SUBSCRIBE_ALL_USERNAME_APPROVED,
  SUBSCRIBE_ALL_USERNAME_CHANGED,
  SUBSCRIBE_ALL_USERNAME_FLAGGED,
  SUBSCRIBE_ALL_USERNAME_REJECTED,
  SUBSCRIBE_COMMENT_ACCEPTED,
  SUBSCRIBE_COMMENT_FLAGGED,
  SUBSCRIBE_COMMENT_REJECTED,
  SUBSCRIBE_COMMENT_RESET,
} = require('../../perms/constants');

const merge = require('lodash/merge');
const debug = require('debug')('talk:graph:setupFunctions');
const plugins = require('../../services/plugins');

const setupFunctions = {
  commentAdded: (options, args, comment, context) => {
    // Only privileged users can subscribe to all assets.
    if (
      !args.asset_id &&
      (!context.user || !context.user.can(SUBSCRIBE_ALL_COMMENT_ADDED))
    ) {
      return false;
    }

    // If user subscribes for statuses other than NONE and/or ACCEPTED statuses, it needs
    // special privileges.
    if (
      (!args.statuses ||
        args.statuses.some(status => !['NONE', 'ACCEPTED'].includes(status))) &&
      (!context.user || !context.user.can(SUBSCRIBE_ALL_COMMENT_ADDED))
    ) {
      return false;
    }

    if (args.asset_id && comment.asset_id !== args.asset_id) {
      return false;
    }

    if (args.statuses && !args.statuses.includes(comment.status)) {
      return false;
    }

    return true;
  },
  commentEdited: (options, args, comment, context) => {
    if (
      !args.asset_id &&
      (!context.user || !context.user.can(SUBSCRIBE_ALL_COMMENT_EDITED))
    ) {
      return false;
    }
    return !args.asset_id || comment.asset_id === args.asset_id;
  },
  commentFlagged: (options, args, comment, context) => {
    if (!context.user || !context.user.can(SUBSCRIBE_COMMENT_FLAGGED)) {
      return false;
    }
    return !args.asset_id || comment.asset_id === args.asset_id;
  },
  commentAccepted: (options, args, comment, context) => {
    if (!context.user || !context.user.can(SUBSCRIBE_COMMENT_ACCEPTED)) {
      return false;
    }
    return !args.asset_id || comment.asset_id === args.asset_id;
  },
  commentRejected: (options, args, comment, context) => {
    if (!context.user || !context.user.can(SUBSCRIBE_COMMENT_REJECTED)) {
      return false;
    }
    return !args.asset_id || comment.asset_id === args.asset_id;
  },
  commentReset: (options, args, comment, context) => {
    if (!context.user || !context.user.can(SUBSCRIBE_COMMENT_RESET)) {
      return false;
    }
    return !args.asset_id || comment.asset_id === args.asset_id;
  },
  userSuspended: (options, args, user, context) => {
    if (
      !context.user ||
      (args.user_id !== user.id &&
        !context.user.can(SUBSCRIBE_ALL_USER_SUSPENDED))
    ) {
      return false;
    }
    return !args.user_id || user.id === args.user_id;
  },
  userBanned: (options, args, user, context) => {
    if (
      !context.user ||
      (args.user_id !== user.id && !context.user.can(SUBSCRIBE_ALL_USER_BANNED))
    ) {
      return false;
    }
    return !args.user_id || user.id === args.user_id;
  },
  usernameFlagged: (options, args, user, context) => {
    if (
      !context.user ||
      (args.user_id !== user.id &&
        !context.user.can(SUBSCRIBE_ALL_USERNAME_FLAGGED))
    ) {
      return false;
    }
    return !args.user_id || user.id === args.user_id;
  },
  usernameRejected: (options, args, user, context) => {
    if (
      !context.user ||
      (args.user_id !== user.id &&
        !context.user.can(SUBSCRIBE_ALL_USERNAME_REJECTED))
    ) {
      return false;
    }
    return !args.user_id || user.id === args.user_id;
  },
  usernameApproved: (options, args, user, context) => {
    if (
      !context.user ||
      (args.user_id !== user.id &&
        !context.user.can(SUBSCRIBE_ALL_USERNAME_APPROVED))
    ) {
      return false;
    }
    return !args.user_id || user.id === args.user_id;
  },
  usernameChanged: (options, args, { user }, context) => {
    if (
      !context.user ||
      (args.user_id !== user.id &&
        !context.user.can(SUBSCRIBE_ALL_USERNAME_CHANGED))
    ) {
      return false;
    }
    return !args.user_id || user.id === args.user_id;
  },
  userCreated: (options, args, user, ctx) =>
    ctx.user && ctx.user.can(SUBSCRIBE_ALL_USER_CREATED),
};

/**
 * Plugin support requires that we merge in existing setupFunctions with our new
 * plugin based ones. This allows plugins to extend existing setupFunctions as
 * well as provide new ones. We'll remap our internal representation of the
 * setupFunctions into the format needed by Apollo.
 */
module.exports = plugins.get('server', 'setupFunctions').reduce(
  (acc, { plugin, setupFunctions }) => {
    debug(`added plugin '${plugin.name}'`);

    return merge(acc, setupFunctions);
  },
  // Process the default setupFunctions.
  Object.entries(setupFunctions)
    .map(([key, filter]) => ({
      [key]: (options, args) => ({
        [key]: {
          filter: (user, ctx) => filter(options, args, user, ctx),
        },
      }),
    }))
    .reduce(
      (setupFunction, setupFunctions) => merge(setupFunctions, setupFunction),
      {}
    )
);
