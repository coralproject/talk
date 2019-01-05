const {
  ErrNotFound,
  ErrNotAuthorized,
  ErrPasswordIncorrect,
} = require('../../errors');
const Users = require('../../services/users');
const migrationHelpers = require('../../services/migration/helpers');
const {
  CHANGE_USERNAME,
  SET_USERNAME,
  SET_USER_USERNAME_STATUS,
  SET_USER_BAN_STATUS,
  SET_USER_ALWAYS_PREMOD_STATUS,
  SET_USER_SUSPENSION_STATUS,
  UPDATE_USER_ROLES,
  DELETE_OTHER_USER,
  CHANGE_PASSWORD,
} = require('../../perms/constants');

const setUserUsernameStatus = async (ctx, id, status) => {
  const user = await Users.setUsernameStatus(id, status, ctx.user.id);
  if (status === 'REJECTED') {
    ctx.pubsub.publish('usernameRejected', user);
  } else if (status === 'APPROVED') {
    ctx.pubsub.publish('usernameApproved', user);
  }
};

const setUserBanStatus = async (ctx, id, status = false, message = null) => {
  const user = await Users.setBanStatus(id, status, ctx.user.id, message);
  if (user.banned) {
    ctx.pubsub.publish('userBanned', user);
  }
};

const setUserAlwaysPremodStatus = async (ctx, id, status = false) => {
  const user = await Users.setAlwaysPremodStatus(id, status, ctx.user.id);
  if (user.alwaysPremod) {
    ctx.pubsub.publish('userAlwaysPremod', user);
  }
};

const setUserSuspensionStatus = async (
  ctx,
  id,
  until = null,
  message = null
) => {
  const user = await Users.setSuspensionStatus(id, until, ctx.user.id, message);
  if (user.suspended) {
    ctx.pubsub.publish('userSuspended', user);
  }
};

const ignoreUser = ({ user }, userToIgnore) => {
  return Users.ignoreUsers(user.id, [userToIgnore.id]);
};

const stopIgnoringUser = ({ user }, userToStopIgnoring) => {
  return Users.stopIgnoringUsers(user.id, [userToStopIgnoring.id]);
};

const changeUsername = async (ctx, id, username) => {
  const user = await Users.changeUsername(id, username, ctx.user.id);
  const previousUsername = ctx.user.username;
  ctx.pubsub.publish('usernameChanged', { previousUsername, user });
  return user;
};

const setUsername = async (ctx, id, username) => {
  return Users.setUsername(id, username, ctx.user.id);
};

const setRole = (ctx, id, role) => {
  return Users.setRole(id, role);
};

/**
 * transforms a specific action to a removal action on the target model.
 */
const actionDecrTransformer = ({ item_id, action_type, group_id }) => {
  const update = {
    $inc: {
      [`action_counts.${action_type.toLowerCase()}`]: -1,
    },
  };

  if (group_id) {
    // If the action had a groupID, also decrement that key.
    update.$inc[
      `action_counts.${action_type.toLowerCase()}_${group_id.toLowerCase()}`
    ] = -1;
  }

  return {
    query: { id: item_id },
    update,
  };
};

// delUser will delete a given user with the specified id.
const delUser = async (ctx, id) => {
  const {
    connectors: {
      models: { User, Action, Comment },
    },
  } = ctx;

  // Find the user we're removing.
  const user = await User.findOne({ id });
  if (!user) {
    throw new ErrNotFound();
  }

  // Get the query transformer we'll use to help batch process the user
  // deletion.
  const { transformSingleWithCursor } = migrationHelpers({
    queryBatchSize: 10000,
    updateBatchSize: 10000,
  });

  // Remove all actions against this users comments.
  await transformSingleWithCursor(
    Action.collection.find({ user_id: user.id, item_type: 'COMMENTS' }),
    actionDecrTransformer,
    Comment
  );

  // Remove all actions against users.
  await transformSingleWithCursor(
    Action.collection.find({ user_id: user.id, item_type: 'USERS' }),
    actionDecrTransformer,
    User
  );

  // Remove all the user's actions.
  await Action.where({ user_id: user.id })
    .setOptions({ multi: true })
    .remove();

  // Remove the user from all other user's ignore lists.
  await User.update(
    { ignoresUsers: user.id },
    {
      $pull: { ignoresUsers: user.id },
    },
    { multi: true }
  );

  // For each comment that the user has authored, purge the comment data from it
  // and unset their id from those comments.
  await transformSingleWithCursor(
    Comment.collection.find({ author_id: user.id }),
    ({
      id,
      asset_id,
      status,
      parent_id,
      reply_count,
      created_at,
      updated_at,
    }) => ({
      query: { id },
      replace: {
        id,
        body: null,
        body_history: [],
        asset_id,
        author_id: null,
        status_history: [],
        status,
        parent_id,
        reply_count,
        action_counts: {},
        tags: [],
        metadata: {},
        deleted_at: new Date(),
        created_at,
        updated_at,
      },
    }),
    Comment
  );

  // Remove the user.
  await user.remove();
};

const changeUserPassword = async (ctx, oldPassword, newPassword) => {
  const {
    user,
    loaders: { Settings },
    connectors: {
      services: { I18n },
    },
  } = ctx;

  // Verify the old password.
  const validPassword = await user.verifyPassword(oldPassword);
  if (!validPassword) {
    throw new ErrPasswordIncorrect();
  }

  // Change the users password now.
  await Users.changePassword(user.id, newPassword);

  // Get some context for the email to be sent.
  const { organizationName, organizationContactEmail } = await Settings.select(
    'organizationName',
    'organizationContactEmail'
  );

  // Send the password change email.
  await Users.sendEmail(user, {
    template: 'plain',
    locals: {
      body: I18n.t('email.password_change.body', organizationContactEmail),
    },
    subject: I18n.t('email.password_change.subject', organizationName),
  });
};

module.exports = ctx => {
  let mutators = {
    User: {
      changeUsername: () => Promise.reject(new ErrNotAuthorized()),
      ignoreUser: () => Promise.reject(new ErrNotAuthorized()),
      setRole: () => Promise.reject(new ErrNotAuthorized()),
      setUserBanStatus: () => Promise.reject(new ErrNotAuthorized()),
      setUserSuspensionStatus: () => Promise.reject(new ErrNotAuthorized()),
      setUserAlwaysPremodStatus: () => Promise.reject(new ErrNotAuthorized()),
      setUserUsernameStatus: () => Promise.reject(new ErrNotAuthorized()),
      setUsername: () => Promise.reject(new ErrNotAuthorized()),
      stopIgnoringUser: () => Promise.reject(new ErrNotAuthorized()),
      del: () => Promise.reject(new ErrNotAuthorized()),
      changePassword: () => Promise.reject(new ErrNotAuthorized()),
    },
  };

  if (ctx.user) {
    mutators.User.ignoreUser = action => ignoreUser(ctx, action);
    mutators.User.stopIgnoringUser = action => stopIgnoringUser(ctx, action);

    if (ctx.user.can(UPDATE_USER_ROLES)) {
      mutators.User.setRole = (id, role) => setRole(ctx, id, role);
    }

    if (ctx.user.can(CHANGE_USERNAME)) {
      mutators.User.changeUsername = (id, username) =>
        changeUsername(ctx, id, username);
    }

    if (ctx.user.can(SET_USERNAME)) {
      mutators.User.setUsername = (id, username) =>
        setUsername(ctx, id, username);
    }

    if (ctx.user.can(SET_USER_USERNAME_STATUS)) {
      mutators.User.setUserUsernameStatus = (id, status) =>
        setUserUsernameStatus(ctx, id, status);
    }

    if (ctx.user.can(SET_USER_BAN_STATUS)) {
      mutators.User.setUserBanStatus = (id, status, message) =>
        setUserBanStatus(ctx, id, status, message);
    }

    if (ctx.user.can(SET_USER_ALWAYS_PREMOD_STATUS)) {
      mutators.User.setUserAlwaysPremodStatus = (id, status) =>
        setUserAlwaysPremodStatus(ctx, id, status);
    }

    if (ctx.user.can(SET_USER_SUSPENSION_STATUS)) {
      mutators.User.setUserSuspensionStatus = (id, until, message) =>
        setUserSuspensionStatus(ctx, id, until, message);
    }

    if (ctx.user.can(DELETE_OTHER_USER)) {
      mutators.User.del = id => delUser(ctx, id);
    }

    if (ctx.user.can(CHANGE_PASSWORD)) {
      mutators.User.changePassword = ({ oldPassword, newPassword }) =>
        changeUserPassword(ctx, oldPassword, newPassword);
    }
  }

  return mutators;
};
