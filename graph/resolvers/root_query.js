const {
  SEARCH_ASSETS,
  SEARCH_OTHERS_COMMENTS,
  SEARCH_COMMENT_METRICS,
  SEARCH_OTHER_USERS
} = require('../../perms/constants');

const RootQuery = {
  assets(_, {query}, {loaders: {Assets}, user}) {
    if (user == null || !user.can(SEARCH_ASSETS)) {
      return null;
    }

    return Assets.search(query);
  },
  asset(_, query, {loaders: {Assets}}) {
    if (query.id) {
      return Assets.getByID.load(query.id);
    }

    return Assets.getByURL(query.url);
  },
  settings(_, args, {loaders: {Settings}}) {
    return Settings.load();
  },

  // This endpoint is used for loading moderation queues, so hide it in the
  // event that we aren't an admin.
  async comments(_, {query}, {user, loaders: {Comments, Actions}}) {
    let {action_type} = query;

    if (user != null && user.can(SEARCH_OTHERS_COMMENTS) && action_type) {
      query.ids = await Actions.getByTypes({action_type, item_type: 'COMMENTS'});
    }

    return Comments.getByQuery(query);
  },

  comment(_, {id}, {loaders: {Comments}}) {
    return Comments.get.load(id);
  },

  async commentCount(_, {query}, {user, loaders: {Actions, Comments}}) {
    if (user == null || !user.can(SEARCH_OTHERS_COMMENTS)) {
      return null;
    }

    const {action_type} = query;

    if (action_type) {
      query.ids = await Actions.getByTypes({action_type, item_type: 'COMMENTS'});
    }

    return Comments.getCountByQuery(query);
  },

  assetMetrics(_, {from, to, sort, limit = 10}, {user, loaders: {Metrics: {Assets}}}) {
    if (user == null || !user.can(SEARCH_ASSETS)) {
      return null;
    }

    if (sort === 'ACTIVITY') {
      return Assets.getActivity({from, to, limit});
    }

    return Assets.get({from, to, sort, limit});
  },

  commentMetrics(_, {from, to, sort, limit = 10}, {user, loaders: {Metrics: {Comments}}}) {
    if (user == null || !user.can(SEARCH_COMMENT_METRICS)) {
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
  },

  // this returns an arbitrary user
  user(_, {id}, {user, loaders: {Users}}) {
    if (user == null || !user.can(SEARCH_OTHER_USERS)) {
      return null;
    }

    return Users.getByID.load(id);
  },

  // This endpoint is used for loading the user moderation queues (users whose username has been flagged),
  // so hide it in the event that we aren't an admin.
  async users(_, {query}, {user, loaders: {Users, Actions}}) {
    if (user == null || !user.can(SEARCH_OTHER_USERS)) {
      return null;
    }

    const {action_type} = query;

    if (action_type) {
      query.ids = await Actions.getByTypes({action_type, item_type: 'USERS'});
      query.statuses = ['PENDING'];
    }

    return Users.getByQuery(query);
  }
};

module.exports = RootQuery;
