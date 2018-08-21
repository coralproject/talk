const { decorateWithPermissionCheck, getRequestedFields } = require('./util');
const {
  SEARCH_ASSETS,
  SEARCH_OTHERS_COMMENTS,
  SEARCH_OTHER_USERS,
} = require('../../perms/constants');

const RootQuery = {
  assets(
    _,
    { query },
    {
      loaders: { Assets },
    }
  ) {
    return Assets.getByQuery(query);
  },
  asset(
    _,
    query,
    {
      loaders: { Assets },
    }
  ) {
    if (query.id) {
      return Assets.getByID.load(query.id);
    }

    return Assets.getByURL(query.url);
  },
  settings(
    _,
    args,
    {
      loaders: { Settings },
    },
    info
  ) {
    // Get the fields we want from the settings.
    const fields = getRequestedFields(info);

    // Load only the requested fields.
    return Settings.select(...fields);
  },

  // This endpoint is used for loading moderation queues, so hide it in the
  // event that we aren't an admin.
  async comments(
    _,
    { query },
    {
      loaders: { Comments },
    }
  ) {
    return Comments.getByQuery(query);
  },

  comment(
    _,
    { id },
    {
      loaders: { Comments },
    }
  ) {
    return Comments.get.load(id);
  },

  async commentCount(
    _,
    { query },
    {
      loaders: { Comments, Assets },
    }
  ) {
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

  async userCount(
    _,
    { query },
    {
      loaders: { Users },
    }
  ) {
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
  user(
    _,
    { id },
    {
      loaders: { Users },
    }
  ) {
    return Users.getByID.load(id);
  },

  // This endpoint is used for loading the user moderation queues (users whose username has been flagged),
  // so hide it in the event that we aren't an admin.
  users(
    _,
    { query },
    {
      loaders: { Users },
    }
  ) {
    return Users.getByQuery(query);
  },
};

// Protect some query fields that are privileged.
decorateWithPermissionCheck(RootQuery, {
  assets: [SEARCH_ASSETS],
  users: [SEARCH_OTHER_USERS],
  userCount: [SEARCH_OTHER_USERS],
  commentCount: [SEARCH_OTHERS_COMMENTS],
});

// Protect the user field so only users who have permission to look up another
// user may do so as well as a user looking up themselves.
decorateWithPermissionCheck(
  RootQuery,
  {
    user: [SEARCH_OTHER_USERS],
  },
  (obj, { id }, { user }) => {
    if (user && user.id === id) {
      return true;
    }

    // We don't return false because we want to fallthrough to the permission
    // check if the custom check fails.
  }
);

module.exports = RootQuery;
