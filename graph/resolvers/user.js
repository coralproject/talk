const User = {
  action_summaries({id}, _, {loaders: {Actions}}) {
    return Actions.getSummariesByItemID.load(id);
  },
  actions({id}, _, {user, loaders: {Actions}}) {

    // Only return the actions if the user is not an admin.
    if (user && user.hasRoles('ADMIN')) {
      return Actions.getByID.load(id);
    }

  },
  comments({id}, _, {loaders: {Comments}, user}) {

    // If the user is not an admin, only return comment list for the owner of
    // the comments.
    if (user && (user.hasRoles('ADMIN') || user.id === id)) {
      return Comments.getByQuery({author_id: id, sort: 'REVERSE_CHRONOLOGICAL'});
    }

    return null;
  },
  profiles({id, profiles}, _, {user}) {

    // if the user is not an admin, do not return the profiles
    if (user && (user.hasRoles('ADMIN') || user.id === id)) {
      return profiles;
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
