const UsersService = require('../../services/users');

/**
 * Updates a users settings.
 * @param  {Object} user the user performing the request
 * @param  {String} bio  the new user bio
 * @return {Promise}
 */
const updateUserSettings = ({user}, {bio}) => {
  return UsersService.updateSettings(user.id, {bio});
};

module.exports = (context) => {

  // TODO: refactor to something that'll return an error in the event an attempt
  // is made to mutate state while not logged in. There's got to be a better way
  // to do this.
  if (context.user && context.user.can('mutation:updateUserSettings')) {
    return {
      User: {
        updateSettings: (settings) => updateUserSettings(context, settings)
      }
    };
  }

  return {
    User: {
      updateSettings: () => {}
    }
  };
};
