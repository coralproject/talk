const Asset = {
  recentComments({id}, _, {loaders: {Comments}}) {
    return Comments.genRecentComments.load(id);
  },
  comments({id}, {sort, limit, notIgnoredBy}, {loaders: {Comments}}) {
    return Comments.getByQuery({
      asset_id: id,
      sort,
      limit,
      parent_id: null,
      notIgnoredBy,
    });
  },
  commentCount({id, commentCount}, {notIgnoredBy}, {loaders: {Comments}}) {
    if (notIgnoredBy) {
      return Comments.parentCountByAssetIDPersonalized({assetId: id, notIgnoredBy});
    }
    if (commentCount != null) {
      return commentCount;
    }
    return Comments.parentCountByAssetID.load(id);
  },
  totalCommentCount({id, totalCommentCount}, {notIgnoredBy}, {loaders: {Comments}}) {
    if (notIgnoredBy) {
      return Comments.countByAssetIDPersonalized({assetId: id, notIgnoredBy});
    }
    if (totalCommentCount != null) {
      return totalCommentCount;
    }
    return Comments.countByAssetID.load(id);
  },
  settings({settings = null}, _, {loaders: {Settings}}) {
    return Settings.load()
      .then((globalSettings) => {
        if (settings) {
          settings = Object.assign({}, globalSettings.toObject(), settings);
        } else {
          settings = globalSettings.toObject();
        }
        return settings;
      });
  }
};

module.exports = Asset;
