const errors = require('../../errors');
const UsersService = require('../../services/users');

const setUserStatus = ({user}, {id, status}) => {
  return UsersService.setStatus(id, status)
  .then(res => res);
};

const suspendUser = ({user}, {id, message}) => {
  return UsersService.suspendUser(id, message)
  .then(res => {
    return res;
  });
};

module.exports = (context) => {
  let mutators = {
    User: {
      setUserStatus: () => Promise.reject(errors.ErrNotAuthorized),
      suspendUser: () => Promise.reject(errors.ErrNotAuthorized)
    }
  };

  if (context.user && context.user.can('mutation:setUserStatus')) {
    mutators.User.setUserStatus = (action) => setUserStatus(context, action);
  }

  if (context.user && context.user.can('mutation:suspendUser')) {
    mutators.User.suspendUser = (action) => suspendUser(context, action);
  }

  return mutators;
};
