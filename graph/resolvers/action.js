const { SEARCH_OTHER_USERS } = require('../../perms/constants');

const Action = {
  __resolveType({ action_type }) {
    switch (action_type) {
      case 'DONTAGREE':
        return 'DontAgreeAction';
      case 'FLAG':
        return 'FlagAction';
      default:
        return undefined;
    }
  },

  // This will load the user for the specific action. We'll limit this to the
  // admin users only or the current logged in user.
  user({ user_id }, _, { loaders: { Users }, user }) {
    if (user && (user.can(SEARCH_OTHER_USERS) || user_id === user.id)) {
      return Users.getByID.load(user_id);
    }
  },
};

module.exports = Action;
