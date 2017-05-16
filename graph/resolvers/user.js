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
  created_at({roles, created_at}, _, {user}) {
    if (user && user.hasRoles('ADMIN')) {
      return created_at;
    }

    return null;
  },
  comments({id}, _, {loaders: {Comments}, user}) {

    // If the user is not an admin, only return comment list for the owner of
    // the comments.
    if (user && (user.hasRoles('ADMIN') || user.id === id)) {
      return Comments.getByQuery({author_id: id, sort: 'REVERSE_CHRONOLOGICAL'});
    }

    return null;
  },
  profiles({profiles}, _, {user}) {

    // if the user is not an admin, do not return the profiles
    if (user && user.hasRoles('ADMIN')) {
      return profiles;
    }

    return null;
  },
  ignoredUsers({id}, args, {user, loaders: {Users}}) {

    // Only allow a logged in user that is either the current user or is a staff
    // member to access the ignoredUsers of a given user.
    if (!user || ((user.id !== id) && !(user.hasRoles('ADMIN') || user.hasRoles('MODERATOR')))) {
      return null;
    }

    // Return nothing if there is nothing to query for.
    if (!user.ignoresUsers || user.ignoresUsers.length <= 0) {
      return [];
    }

    return Users.getByQuery({ids: user.ignoresUsers});
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
