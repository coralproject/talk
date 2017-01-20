const RootQuery = {
  assets(_, args, {loaders, user}) {
    if (user.hasRole('admin')) {
      return loaders.Assets.getAll.load();
    }
  },
  asset(_, query, {loaders}) {
    if (query.id) {

      // TODO: we may not always have a comment stream here, therefore, when we
      // load it, we may also need to create with the url. This may also have to
      // move the logic over to the mutators function as an upsert operation
      // possibly.
      return loaders.Assets.getByID.load(query.id);
    }

    return loaders.Assets.getByURL(query.url);
  },
  settings(_, args, {loaders}) {
    return loaders.Settings.load();
  },

  // This endpoint is used for loading moderation queues, so hide it in the
  // event that we aren't an admin.
  comments(_, {query}, {loaders, user}) {
    if (user == null || !user.hasRole('admin')) {
      return null;
    }

    if (query.action_type) {
      return loaders.Comments.getByActionTypeAndAssetID(query);
    } else {
      return loaders.Comments.getByStatusAndAssetID(query);
    }
  },

  // This returns the current user, ensure that if we aren't logged in, we
  // return null.
  me(_, args, {user}) {
    if (user == null) {
      return null;
    }

    return user;
  }
};

module.exports = RootQuery;
