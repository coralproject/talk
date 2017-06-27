const {decorateWithTags} = require('./util');

const Asset = {
  recentComments({id}, _, {loaders: {Comments}}) {
    return Comments.genRecentComments.load(id);
  },
  comments({id}, {sort, limit, excludeIgnored}, {loaders: {Comments}}) {
    return Comments.getByQuery({
      asset_id: id,
      sort,
      limit,
      parent_id: null,
      excludeIgnored,
    });
  },
  commentCount({id, commentCount}, {excludeIgnored}, {user, loaders: {Comments}}) {
    
    // TODO: remove
    if (user && excludeIgnored) {
      return Comments.parentCountByAssetIDPersonalized({assetId: id, excludeIgnored});
    }
    if (commentCount != null) {
      return commentCount;
    }
    return Comments.parentCountByAssetID.load(id);
  },
  totalCommentCount({id, totalCommentCount}, {excludeIgnored}, {user, loaders: {Comments}}) {

    // TODO: remove
    if (user && excludeIgnored) {
      return Comments.countByAssetIDPersonalized({assetId: id, excludeIgnored});
    }
    if (totalCommentCount != null) {
      return totalCommentCount;
    }
    return Comments.countByAssetID.load(id);
  },
  async settings({settings = null}, _, {loaders: {Settings}}) {

    // Load the global settings, and merge them into the asset specific settings
    // if we have some.
    let globalSettings = await Settings.load();
    if (settings !== null) {
      settings = Object.assign({}, globalSettings.toObject(), settings);
    } else {
      settings = globalSettings.toObject();
    }

    return settings;
  }
};

// Decorate the Asset type resolver with a tags field.
decorateWithTags(Asset);

module.exports = Asset;
