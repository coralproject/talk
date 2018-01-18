const errors = require('../../errors');
const UsersService = require('../../services/users');
const {
  CHANGE_USERNAME,
  SET_USERNAME,
  SET_USER_USERNAME_STATUS,
  SET_USER_BAN_STATUS,
  SET_USER_SUSPENSION_STATUS,
  UPDATE_USER_ROLES,
} = require('../../perms/constants');

const setUserUsernameStatus = async (ctx, id, status) => {
  const user = await UsersService.setUsernameStatus(id, status, ctx.user.id);
  if (status === 'REJECTED') {
    ctx.pubsub.publish('usernameRejected', user);
  } else if (status === 'APPROVED') {
    ctx.pubsub.publish('usernameApproved', user);
  }
};

const setUserBanStatus = async (ctx, id, status = false, message = null) => {
  const user = await UsersService.setBanStatus(
    id,
    status,
    ctx.user.id,
    message
  );
  if (user.banned) {
    ctx.pubsub.publish('userBanned', user);
  }
};

const setUserSuspensionStatus = async (
  ctx,
  id,
  until = null,
  message = null
) => {
  const user = await UsersService.setSuspensionStatus(
    id,
    until,
    ctx.user.id,
    message
  );
  if (user.suspended) {
    ctx.pubsub.publish('userSuspended', user);
  }
};

const ignoreUser = ({ user }, userToIgnore) => {
  return UsersService.ignoreUsers(user.id, [userToIgnore.id]);
};

const stopIgnoringUser = ({ user }, userToStopIgnoring) => {
  return UsersService.stopIgnoringUsers(user.id, [userToStopIgnoring.id]);
};

const changeUsername = async (ctx, id, username) => {
  const user = await UsersService.changeUsername(id, username, ctx.user.id);
  const previousUsername = ctx.user.username;
  ctx.pubsub.publish('usernameChanged', { previousUsername, user });
  return user;
};

const setUsername = async (ctx, id, username) => {
  return UsersService.setUsername(id, username, ctx.user.id);
};

const setRole = (ctx, id, role) => {
  return UsersService.setRole(id, role);
};

module.exports = ctx => {
  let mutators = {
    User: {
      changeUsername: () => Promise.reject(errors.ErrNotAuthorized),
      ignoreUser: () => Promise.reject(errors.ErrNotAuthorized),
      setRole: () => Promise.reject(errors.ErrNotAuthorized),
      setUserBanStatus: () => Promise.reject(errors.ErrNotAuthorized),
      setUserSuspensionStatus: () => Promise.reject(errors.ErrNotAuthorized),
      setUserUsernameStatus: () => Promise.reject(errors.ErrNotAuthorized),
      setUsername: () => Promise.reject(errors.ErrNotAuthorized),
      stopIgnoringUser: () => Promise.reject(errors.ErrNotAuthorized),
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

    if (ctx.user.can(SET_USER_SUSPENSION_STATUS)) {
      mutators.User.setUserSuspensionStatus = (id, until, message) =>
        setUserSuspensionStatus(ctx, id, until, message);
    }
  }

  return mutators;
};
