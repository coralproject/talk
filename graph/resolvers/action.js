const Action = {
  action_type({action_type}) {

    // FIXME: remove once we cast the data model to have uppercase action
    // types.
    return action_type.toUpperCase();
  },
  item_type({item_type}) {

    // FIXME: remove once we cast the data model to have uppercase item
    // types.
    return item_type.toUpperCase();
  },

  // This will load the user for the specific action. We'll limit this to the
  // admin users only.
  user({user_id}, _, {loaders, user}) {
    if (user.hasRole('admin')) {
      return loaders.Users.getByID.load(user_id);
    }
  }
};

module.exports = Action;
