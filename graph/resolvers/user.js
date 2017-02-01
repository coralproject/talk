const User = {
  actions({id}, _, {loaders: {Actions}}) {
    return Actions.getSummariesByItemID.load(id);
  },
  comments({id}, _, {loaders: {Comments}, user}) {

    // If the user is not an admin, only return comment list for the owner of
    // the comments.
    if (user && (user.hasRoles('ADMIN') || user.id === id)) {
      return Comments.getByQuery({author_id: id});
    }

    return null;
  },
  roles({id, roles}, _, {user}) {

    // If the user is not an admin, only return the current user's roles.
    if (user && (user.hasRoles('ADMIN') || user.id === id)) {
      return roles;
    }

    return null;
  }
};

module.exports = User;
