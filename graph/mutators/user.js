const errors = require('../../errors');
const UserModel = require('../../models/user');
const UsersService = require('../../services/users');
const {
  SET_USER_USERNAME_STATUS,
  SET_USER_BAN_STATUS,
  SET_USER_SUSPENSION_STATUS,
} = require('../../perms/constants');

const setUserUsernameStatus = async (ctx, id, status) => {
  const user = await UserModel.findOneAndUpdate({id}, {
    $set: {
      'status.username.status': status
    },
    $push: {
      'status.username.history': {
        status,
        assigned_by: ctx.user.id,
        created_at: Date.now()
      }
    }
  }, {
    new: true
  });
  if (user === null) {
    throw errors.ErrNotFound;
  }

  if (status === 'REJECTED') {
    ctx.pubsub.publish('usernameRejected', user);
  }
};

const setUserBanStatus = async (ctx, id, status) => {
  const user = await UserModel.findOneAndUpdate({id}, {
    $set: {
      'status.banned.status': status
    },
    $push: {
      'status.banned.history': {
        status,
        assigned_by: ctx.user.id,
        created_at: Date.now()
      }
    }
  }, {
    new: true
  });
  if (user === null) {
    throw errors.ErrNotFound;
  }

  if (user.banned) {
    ctx.pubsub.publish('userBanned', user);
  }
};

const setUserSuspensionStatus = async (ctx, id, until) => {
  const user = await UserModel.findOneAndUpdate({id}, {
    $set: {
      'status.suspension.until': until
    },
    $push: {
      'status.suspension.history': {
        until,
        assigned_by: ctx.user.id,
        created_at: Date.now()
      }
    }
  }, {
    new: true
  });
  if (user === null) {
    throw errors.ErrNotFound;
  }

  if (user.suspended) {
    ctx.pubsub.publish('userSuspended', user);
  }
};

const ignoreUser = ({user}, userToIgnore) => {
  return UsersService.ignoreUsers(user.id, [userToIgnore.id]);
};

const stopIgnoringUser = ({user}, userToStopIgnoring) => {
  return UsersService.stopIgnoringUsers(user.id, [userToStopIgnoring.id]);
};

module.exports = (ctx) => {
  let mutators = {
    User: {
      ignoreUser: () => Promise.reject(errors.ErrNotAuthorized),
      stopIgnoringUser: () => Promise.reject(errors.ErrNotAuthorized),
      setUserUsernameStatus: () => Promise.reject(errors.ErrNotAuthorized),
      setUserBanStatus: () => Promise.reject(errors.ErrNotAuthorized),
      setUserSuspensionStatus: () => Promise.reject(errors.ErrNotAuthorized),
    }
  };

  if (ctx.user) {
    mutators.User.ignoreUser = (action) => ignoreUser(ctx, action);
    mutators.User.stopIgnoringUser = (action) => stopIgnoringUser(ctx, action);

    if (ctx.user.can(SET_USER_USERNAME_STATUS)) {
      mutators.User.setUserUsernameStatus = (id, status) => setUserUsernameStatus(ctx, id, status);
    }

    if (ctx.user.can(SET_USER_BAN_STATUS)) {
      mutators.User.setUserBanStatus = (id, status) => setUserBanStatus(ctx, id, status);
    }

    if (ctx.user.can(SET_USER_SUSPENSION_STATUS)) {
      mutators.User.setUserSuspensionStatus = (id, until) => setUserSuspensionStatus(ctx, id, until);
    }
  }

  return mutators;
};
