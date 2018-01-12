const { decorateWithTags } = require('./util');

const Asset = {
  async comment({ id }, { id: commentId }, { loaders: { Comments } }) {
    // Load the comment from the database.
    const comment = await Comments.get.load(commentId);
    if (!comment) {
      return null;
    }

    // If the comment asset mismatches, then don't return it!
    if (comment.asset_id !== id) {
      return null;
    }

    return comment;
  },
  comments({ id }, { query, deep }, { loaders: { Comments } }) {
    if (!deep) {
      query.parent_id = null;
    }

    // Include the asset id in the search.
    query.asset_id = id;

    return Comments.getByQuery(query);
  },
  commentCount({ id, commentCount }, { tags }, { loaders: { Comments } }) {
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
  totalCommentCount(
    { id, totalCommentCount },
    { tags },
    { loaders: { Comments } }
  ) {
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
  async settings({ settings = null }, _, { loaders: { Settings } }) {
    // Load the global settings, and merge them into the asset specific settings
    // if we have some.
    let globalSettings = await Settings.load();
    if (settings !== null) {
      settings = Object.assign({}, globalSettings.toObject(), settings);
    } else {
      settings = globalSettings.toObject();
    }

    return settings;
  },
};

// Decorate the Asset type resolver with a tags field.
decorateWithTags(Asset);

module.exports = Asset;
