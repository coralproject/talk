const errors = require('../../errors');
const UsersService = require('../../services/users');
const {SET_USER_STATUS, SUSPEND_USER, REJECT_USERNAME} = require('../../perms/constants');

const setUserStatus = async ({pubsub}, {id, status}) => {
  const result = await UsersService.setStatus(id, status);
  if (result && result.status === 'BANNED') {
    pubsub.publish('userBanned', result);
  }
  return result;
};

const suspendUser = async ({pubsub}, {id, message, until}) => {
  const result = await UsersService.suspendUser(id, message, until);
  if (result) {
    pubsub.publish('userSuspended', result);
  }
  return result;
};

const rejectUsername = async ({pubsub}, {id, message}) => {
  const result = await UsersService.rejectUsername(id, message);
  if (result) {
    pubsub.publish('usernameRejected', result);
  }
  return result;
};

const ignoreUser = ({user}, userToIgnore) => {
  return UsersService.ignoreUsers(user.id, [userToIgnore.id]);
};

const stopIgnoringUser = ({user}, userToStopIgnoring) => {
  return UsersService.stopIgnoringUsers(user.id, [userToStopIgnoring.id]);
};

module.exports = (context) => {
  let mutators = {
    User: {
      setUserStatus: () => Promise.reject(errors.ErrNotAuthorized),
      suspendUser: () => Promise.reject(errors.ErrNotAuthorized),
      rejectUsername: () => Promise.reject(errors.ErrNotAuthorized),
      ignoreUser: (action) => ignoreUser(context, action),
      stopIgnoringUser: (action) => stopIgnoringUser(context, action),
    }
  };

  if (context.user && context.user.can(SET_USER_STATUS)) {
    mutators.User.setUserStatus = (action) => setUserStatus(context, action);
  }

  if (context.user && context.user.can(SUSPEND_USER)) {
    mutators.User.suspendUser = (action) => suspendUser(context, action);
  }

  if (context.user && context.user.can(REJECT_USERNAME)) {
    mutators.User.rejectUsername = (action) => rejectUsername(context, action);
  }

  return mutators;
};
