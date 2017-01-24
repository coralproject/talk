const Action = {

  // This will load the user for the specific action. We'll limit this to the
  // admin users only.
  user({user_id}, _, {loaders, user}) {
    if (user.hasRole('admin')) {
      return loaders.Users.getByID.load(user_id);
    }
  }
};

module.exports = Action;
