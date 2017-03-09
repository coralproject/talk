const RootQuery = {
  assets(_, args, {loaders: {Assets}, user}) {
    if (user == null || !user.hasRoles('ADMIN')) {
      return null;
    }

    return Assets.getAll.load();
  },
  asset(_, query, {loaders: {Assets}}) {
    if (query.id) {

      // TODO: we may not always have a comment stream here, therefore, when we
      // load it, we may also need to create with the url. This may also have to
      // move the logic over to the mutators function as an upsert operation
      // possibly.
      return Assets.getByID.load(query.id);
    }

    return Assets.getByURL(query.url);
  },
  settings(_, args, {loaders: {Settings}}) {
    return Settings.load();
  },

  // This endpoint is used for loading moderation queues, so hide it in the
  // event that we aren't an admin.
  comments(_, {query: {action_type, statuses, asset_id, parent_id, limit, cursor, sort}}, {user, loaders: {Comments, Actions}}) {
    let query = {statuses, asset_id, parent_id, limit, cursor, sort};

    if (user != null && user.hasRoles('ADMIN') && action_type) {
      return Actions.getByTypes({action_type, item_type: 'COMMENTS'})
        .then((ids) => {

          // Perform the query using the available resolver.
          return Comments.getByQuery({ids, statuses, asset_id, parent_id, limit, cursor, sort});
        });
    }

    return Comments.getByQuery(query);
  },
  comment(_, {id}, {loaders: {Comments}}) {
    return Comments.get.load(id);
  },
  commentCount(_, {query: {action_type, statuses, asset_id, parent_id}}, {user, loaders: {Actions, Comments}}) {
    if (user == null || !user.hasRoles('ADMIN')) {
      return null;
    }

    if (action_type) {
      return Actions.getByTypes({action_type, item_type: 'COMMENTS'})
        .then((ids) => {

          // Perform the query using the available resolver.
          return Comments.getCountByQuery({ids, statuses, asset_id, parent_id});
        });
    }

    return Comments.getCountByQuery({statuses, asset_id, parent_id});
  },

  assetMetrics(_, {from, to, sort, limit = 10}, {user, loaders: {Metrics: {Assets}}}) {
    if (user == null || !user.hasRoles('ADMIN')) {
      return null;
    }

    console.log({from, to, sort, limit});

    if (sort === 'ACTIVITY') {
      return Assets.getActivity({from, to, limit});
    }

    return Assets.get({from, to, sort, limit});
  },

  commentMetrics(_, {from, to, sort, limit = 10}, {user, loaders: {Metrics: {Comments}}}) {
    if (user == null || !user.hasRoles('ADMIN')) {
      return null;
    }

    return Comments.get({from, to, sort, limit});
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
