const User = {
  actions({id}, _, {loaders}) {
    return loaders.Actions.getByID.load(id);
  },
  comments({id}, _, {loaders, user}) {

    // If the user is not an admin, only return comment list for the owner of
    // the comments.
    if (!user.hasRoles('admin') || user.id !== id) {
      return null;
    }

    return loaders.Comments.getByAuthorID.load(id);
  }
};

module.exports = User;
