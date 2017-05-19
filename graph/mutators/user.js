const errors = require('../../errors');
const UsersService = require('../../services/users');
const {SET_USER_STATUS, SUSPEND_USER, REJECT_USERNAME} = require('../../perms/constants');

const setUserStatus = ({user}, {id, status}) => {
  return UsersService.setStatus(id, status);
};

const suspendUser = ({user}, {id, message, until}) => {
  return UsersService.suspendUser(id, message, until);
};

const rejectUsername = ({user}, {id, message}) => {
  return UsersService.rejectUsername(id, message);
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
