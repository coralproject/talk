const { URL } = require('url');
const { property } = require('lodash');
const {
  SEARCH_ACTIONS,
  SEARCH_COMMENT_STATUS_HISTORY,
  VIEW_BODY_HISTORY,
  VIEW_COMMENT_DELETED_AT,
} = require('../../perms/constants');
const {
  decorateWithTags,
  decorateWithPermissionCheck,
  checkSelfField,
} = require('./util');

const Comment = {
  hasParent({ parent_id }) {
    return !!parent_id;
  },
  parent(
    { parent_id },
    _,
    {
      loaders: { Comments },
    }
  ) {
    if (parent_id == null) {
      return null;
    }

    return Comments.get.load(parent_id);
  },
  user(
    { author_id },
    _,
    {
      loaders: { Users },
    }
  ) {
    if (author_id) {
      return Users.getByID.load(author_id);
    }
  },
  replies(
    { id, asset_id, reply_count },
    { query },
    {
      loaders: { Comments },
    }
  ) {
    // Don't bother looking up replies if there aren't any there!
    if (reply_count === 0) {
      return {
        nodes: [],
        hasNextPage: false,
      };
    }

    query.asset_id = asset_id;
    query.parent_id = id;
    query.statuses = ['NONE', 'ACCEPTED'];

    return Comments.getByQuery(query);
  },
  replyCount: property('reply_count'),
  actions(
    { id },
    _,
    {
      loaders: { Actions },
    }
  ) {
    return Actions.getByID.load(id);
  },
  action_summaries(
    comment,
    _,
    {
      loaders: { Actions },
    }
  ) {
    if (comment.action_summaries) {
      return comment.action_summaries;
    }

    return Actions.getSummariesByItem.load(comment);
  },
  asset(
    { asset_id },
    _,
    {
      loaders: { Assets },
    }
  ) {
    return Assets.getByID.load(asset_id);
  },
  editing: async (comment, _, { loaders: { Settings } }) => {
    const editCommentWindowLength = await Settings.get(
      'editCommentWindowLength'
    );

    const editableUntil = new Date(
      Number(new Date(comment.created_at)) + editCommentWindowLength
    );

    return {
      edited: comment.edited,
      editableUntil: editableUntil,
    };
  },
  async url(
    comment,
    args,
    {
      loaders: { Assets },
    }
  ) {
    const asset = await Assets.getByID.load(comment.asset_id);
    if (!asset) {
      return null;
    }

    const assetURL = new URL(asset.url);
    assetURL.searchParams.set('commentId', comment.id);
    return assetURL.href;
  },
};

// Decorate the Comment type resolver with a tags field.
decorateWithTags(Comment);

// Protect direct action and status history access.
decorateWithPermissionCheck(Comment, {
  actions: [SEARCH_ACTIONS],
  status_history: [SEARCH_COMMENT_STATUS_HISTORY],
  deleted_at: [VIEW_COMMENT_DELETED_AT],
});

// Protect privileged fields.
decorateWithPermissionCheck(
  Comment,
  {
    body_history: [VIEW_BODY_HISTORY],
  },
  checkSelfField('author_id')
);

module.exports = Comment;
