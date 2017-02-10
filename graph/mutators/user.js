const UsersService = require('../../services/users');

const setUserStatus = ({user}, {id, status}) => {
  console.log('------as-d-asd-a-sads-a-sad-dsa-----');
  console.log('user', user);
  console.log('id', id);
  console.log('status', status);

  return UsersService.setStatus(id, status)
  .then((user) => {
    console.log('result', user);
    return user;
  });
};

module.exports = (context) => {

  // TODO: refactor to something that'll return an error in the event an attempt
  // is made to mutate state while not logged in. There's got to be a better way
  // to do this.
  if (context.user && context.user.can('mutation:setUserStatus')) {
    return {
      User: {
        setUserStatus: (action) => setUserStatus(context, action)
      }
    };
  }

  return {
    User: {
      setUserStatus: () => {},
    }
  };
};
