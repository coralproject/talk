const errors = require('../../errors');
const UsersService = require('../../services/users');

const setUserStatus = ({user}, {id, status}) => {
  return UsersService.setStatus(id, status)
  .then(res => res);
};

module.exports = (context) => {
  if (context.user && context.user.can('mutation:setUserStatus')) {
    return {
      User: {
        setUserStatus: (action) => setUserStatus(context, action)
      }
    };
  }

  return {
    User: {
      setUserStatus: () => Promise.reject(errors.ErrNotAuthorized)
    }
  };
};
