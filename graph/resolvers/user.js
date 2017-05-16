const User = {
  action_summaries({id}, _, {loaders: {Actions}}) {
    return Actions.getSummariesByItemID.load(id);
  },
  actions({id}, _, {user, loaders: {Actions}}) {

    // Only return the actions if the user is not an admin.
    if (user && user.can('SEARCH_ACTIONS')) {
      return Actions.getByID.load(id);
    }

  },
  comments({id}, _, {loaders: {Comments}, user}) {

    // If the user is not an admin, only return comment list for the owner of
    // the comments.
    if (user && (user.can('SEARCH_OTHERS_COMMENTS') || user.id === id)) {
      return Comments.getByQuery({author_id: id, sort: 'REVERSE_CHRONOLOGICAL'});
    }

    return null;
  },
  roles({id, roles}, _, {user}) {

    // If the user is not an admin, only return the current user's roles.
    if (user && (user.can('UPDATE_USER_ROLES') || user.id === id)) {
      return roles;
    }

    return null;
  }
};

module.exports = User;
