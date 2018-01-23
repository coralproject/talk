const {
  SEARCH_ASSETS,
  SEARCH_OTHERS_COMMENTS,
  SEARCH_OTHER_USERS,
} = require('../../perms/constants');

const RootQuery = {
  assets(_, { query }, { loaders: { Assets }, user }) {
    if (user == null || !user.can(SEARCH_ASSETS)) {
      return null;
    }

    return Assets.getByQuery(query);
  },
  asset(_, query, { loaders: { Assets } }) {
    if (query.id) {
      return Assets.getByID.load(query.id);
    }

    return Assets.getByURL(query.url);
  },
  settings(_, args, { loaders: { Settings } }) {
    return Settings.load();
  },

  // This endpoint is used for loading moderation queues, so hide it in the
  // event that we aren't an admin.
  async comments(_, { query }, { loaders: { Comments } }) {
    return Comments.getByQuery(query);
  },

  comment(_, { id }, { loaders: { Comments } }) {
    return Comments.get.load(id);
  },

  async commentCount(_, { query }, { user, loaders: { Comments, Assets } }) {
    if (user == null || !user.can(SEARCH_OTHERS_COMMENTS)) {
      return null;
    }

    const { asset_url, asset_id } = query;
    if (
      (!asset_id || asset_id.length === 0) &&
      asset_url &&
      asset_url.length > 0
    ) {
      let asset = await Assets.findByUrl(asset_url);
      if (asset) {
        query.asset_id = asset.id;
      }
    }

    return Comments.getCountByQuery(query);
  },

  async userCount(_, { query }, { user, loaders: { Users } }) {
    if (user == null || !user.can(SEARCH_OTHER_USERS)) {
      return null;
    }

    return Users.getCountByQuery(query);
  },

  // This returns the current user, ensure that if we aren't logged in, we
  // return null.
  me(_, args, { user }) {
    if (user == null) {
      return null;
    }

    return user;
  },

  // this returns an arbitrary user
  user(_, { id }, { user, loaders: { Users } }) {
    if (user == null || !user.can(SEARCH_OTHER_USERS)) {
      return null;
    }

    return Users.getByID.load(id);
  },

  // This endpoint is used for loading the user moderation queues (users whose username has been flagged),
  // so hide it in the event that we aren't an admin.
  users(_, { query }, { user, loaders: { Users } }) {
    if (user == null || !user.can(SEARCH_OTHER_USERS)) {
      return null;
    }

    return Users.getByQuery(query);
  },
};

module.exports = RootQuery;
