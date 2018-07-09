const mongoose = require('../../services/mongoose');
const Schema = mongoose.Schema;
const TagLinkSchema = require('./tag_link');
const uuid = require('uuid');
const COMMENT_STATUS = require('../enum/comment_status');

/**
 * The Mongo schema for a Comment Status.
 * @type {Schema}
 */
const Status = new Schema(
  {
    type: {
      type: String,
      enum: COMMENT_STATUS,
    },

    // The User ID of the user that assigned the status.
    assigned_by: {
      type: String,
      default: null,
    },

    created_at: Date,
  },
  {
    _id: false,
  }
);

/**
 * A record of old body values for a Comment
 */
const BodyHistoryItemSchema = new Schema({
  body: {
    required: true,
    type: String,
  },

  // datetime until the comment body value was this.body
  created_at: {
    required: true,
    type: Date,
    default: Date,
  },
});

/**
 * The Mongo schema for a Comment.
 * @type {Schema}
 */
const Comment = new Schema(
  {
    id: {
      type: String,
      default: uuid.v4,
      unique: true,
      index: true,
    },
    body: {
      type: String,
    },
    body_history: [BodyHistoryItemSchema],
    asset_id: {
      type: String,
      index: true,
    },
    author_id: String,
    status_history: [Status],
    status: {
      type: String,
      enum: COMMENT_STATUS,
      default: 'NONE',
    },

    // parent_id is the id of the parent comment (null if there is none).
    parent_id: String,

    // The number of replies to this comment directly.
    reply_count: {
      type: Number,
      default: 0,
    },

    // Counts to store related to actions taken on the given comment.
    action_counts: {
      default: {},
      type: Object,
    },

    // Tags are added by the self or by administrators.
    tags: [TagLinkSchema],

    // deleted_at stores the date that the given comment was deleted.
    deleted_at: {
      type: Date,
    },

    // Additional metadata stored on the field.
    metadata: {
      default: {},
      type: Object,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toJSON: {
      virtuals: true,
    },
  }
);

Comment.index(
  {
    deleted_at: 1,
    created_at: -1,
  },
  { partialFilterExpression: { deleted_at: null } }
);

Comment.index(
  {
    deleted_at: 1,
    status: 1,
    created_at: -1,
  },
  { partialFilterExpression: { deleted_at: null } }
);

Comment.index({
  asset_id: 1,
  created_at: -1,
});

Comment.index({
  asset_id: 1,
  created_at: 1,
});

Comment.index({
  author_id: 1,
  created_at: -1,
});

Comment.index({
  asset_id: 1,
  status: 1,
});

Comment.index({
  asset_id: 1,
  parent_id: 1,
  reply_count: -1,
  created_at: -1,
});

Comment.index({
  asset_id: 1,
  reply_count: -1,
  created_at: -1,
});

Comment.index({
  asset_id: 1,
  parent_id: 1,
  created_at: 1,
});

Comment.index(
  {
    'action_counts.flag': 1,
    status: 1,
    created_at: -1,
  },
  {
    partialFilterExpression: {
      'action_counts.flag': { $exists: true, $gt: 0 },
      deleted_at: null,
    },
  }
);

// Optimize for tag searches/counts.
Comment.index(
  {
    asset_id: 1,
    'tags.tag.name': 1,
    status: 1,
  },
  {
    sparse: true,
  }
);

Comment.virtual('edited').get(function() {
  return this.body_history.length > 1;
});

// Visible is true when the comment is visible to the public.
Comment.virtual('visible').get(function() {
  return ['ACCEPTED', 'NONE'].includes(this.status);
});

module.exports = Comment;
