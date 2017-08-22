const {decorateWithTags} = require('./util');

const Comment = {
  hasParent({parent_id}) {
    return !!parent_id;
  },
  parent({parent_id}, _, {loaders: {Comments}}) {
    if (parent_id == null) {
      return null;
    }

    return Comments.get.load(parent_id);
  },
  user({author_id}, _, {loaders: {Users}}) {
    return Users.getByID.load(author_id);
  },
  replies({id, asset_id, reply_count}, {query: {sort, sortBy, limit, excludeIgnored}}, {loaders: {Comments}}) {

    // Don't bother looking up replies if there aren't any there!
    if (reply_count === 0) {
      return {
        nodes: [],
        hasNextPage: false,
      };
    }

    return Comments.getByQuery({
      asset_id,
      parent_id: id,
      sort,
      sortBy,
      limit,
      excludeIgnored,
    });
  },
  replyCount({reply_count}) {

    // A simple remap from the underlying database model to the graph model.
    return reply_count;
  },
  actions({id}, _, {user, loaders: {Actions}}) {
    if (!user || !user.can('SEARCH_ACTIONS')) {
      return null;
    }

    return Actions.getByID.load(id);
  },
  action_summaries({id, action_summaries}, _, {loaders: {Actions}}) {
    if (action_summaries) {
      return action_summaries;
    }

    return Actions.getSummariesByItemID.load(id);
  },
  asset({asset_id}, _, {loaders: {Assets}}) {
    return Assets.getByID.load(asset_id);
  },
  async editing(comment, _, {loaders: {Settings}}) {
    const settings = await Settings.load();
    const editableUntil = new Date(Number(new Date(comment.created_at)) + settings.editCommentWindowLength);
    return {
      edited: comment.edited,
      editableUntil: editableUntil
    };
  }
};

// Decorate the Comment type resolver with a tags field.
decorateWithTags(Comment);

module.exports = Comment;
