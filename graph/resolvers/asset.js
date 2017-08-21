const {decorateWithTags} = require('./util');
const {
  SEARCH_NON_NULL_OR_ACCEPTED_COMMENTS,
} = require('../../perms/constants');

const Asset = {
  async comment({id}, {id: commentId}, {loaders: {Comments}, user}) {
    const statuses = user && user.can(SEARCH_NON_NULL_OR_ACCEPTED_COMMENTS)
      ? ['NONE', 'ACCEPTED', 'PREMOD', 'REJECTED']
      : ['NONE', 'ACCEPTED'];

    const comments = await Comments.getByQuery({
      asset_id: id,
      ids: commentId,
      statuses,
    });

    return comments.nodes[0];
  },
  comments({id}, {query: {sort, limit, excludeIgnored, tags}, deep}, {loaders: {Comments}}) {
    return Comments.getByQuery({
      asset_id: id,
      sort,
      limit,
      parent_id: deep ? undefined : null,
      tags,
      excludeIgnored,
    });
  },
  commentCount({id, commentCount}, {tags}, {loaders: {Comments}}) {
    if (commentCount != null) {
      return commentCount;
    }

    // If we are filtering by a tag.
    if (tags && tags.length > 0) {

      // Then count the comments with those tags.
      return Comments.getCountByQuery({
        tags,
        asset_id: id,
        parent_id: null,
        statuses: ['NONE', 'ACCEPTED'],
      });
    }

    return Comments.parentCountByAssetID.load(id);
  },
  totalCommentCount({id, totalCommentCount}, {tags}, {loaders: {Comments}}) {
    if (totalCommentCount != null) {
      return totalCommentCount;
    }

    // If we are filtering by a tag.
    if (tags && tags.length > 0) {

      // Then count the comments with those tags.
      return Comments.getCountByQuery({
        tags,
        asset_id: id,
        statuses: ['NONE', 'ACCEPTED'],
      });
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
