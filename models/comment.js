const mongoose = require('../services/mongoose');
const Schema = mongoose.Schema;
const TagLinkSchema = require('./schema/tag_link');
const uuid = require('uuid');
const COMMENT_STATUS = require('./enum/comment_status');

/**
 * The Mongo schema for a Comment Status.
 * @type {Schema}
 */
const StatusSchema = new Schema(
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
const CommentSchema = new Schema(
  {
    id: {
      type: String,
      default: uuid.v4,
      unique: true,
    },
    body: {
      type: String,
      required: [true, 'The body is required.'],
      minlength: 2,
    },
    body_history: [BodyHistoryItemSchema],
    asset_id: String,
    author_id: String,
    status_history: [StatusSchema],
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

// Add the indexes for the id of the comment.
CommentSchema.index(
  {
    id: 1,
  },
  {
    unique: true,
    background: false,
  }
);

CommentSchema.index(
  {
    status: 1,
    created_at: 1,
  },
  {
    background: true,
  }
);

CommentSchema.index(
  {
    status: 1,
    created_at: 1,
    asset_id: 1,
  },
  {
    background: true,
  }
);

// Create a sparse index to search across.
CommentSchema.index(
  {
    created_at: 1,
    'action_counts.flag': 1,
    status: 1,
  },
  {
    background: true,
    sparse: true,
  }
);

// Create a sparse index to search across.
CommentSchema.index(
  {
    'action_counts.flag': 1,
    status: 1,
  },
  {
    background: true,
    sparse: true,
  }
);

// Add an index that is optimized for finding flagged comments.
CommentSchema.index(
  {
    asset_id: 1,
    created_at: 1,
    'action_counts.flag': 1,
  },
  {
    background: true,
  }
);

// Add an index for the reply sort.
CommentSchema.index(
  {
    asset_id: 1,
    created_at: -1,
    reply_count: -1,
  },
  {
    background: true,
  }
);

// Optimize for tag searches/counts.
CommentSchema.index(
  {
    asset_id: 1,
    'tags.tag.name': 1,
    status: 1,
  },
  {
    background: true,
  }
);

// Optimize for tag searches/counts.
CommentSchema.index(
  {
    'tags.tag.name': 1,
    status: 1,
  },
  {
    background: true,
    sparse: true,
  }
);

// Add an index that is optimized for sorting based on the created_at timestamp
// but also good at locating comments that have a specific asset id.
CommentSchema.index(
  {
    asset_id: 1,
    created_at: 1,
  },
  {
    background: true,
  }
);

CommentSchema.virtual('edited').get(function() {
  return this.body_history.length > 1;
});

// Visable is true when the comment is visible to the public.
CommentSchema.virtual('visible').get(function() {
  return ['ACCEPTED', 'NONE'].includes(this.status);
});

module.exports = mongoose.model('Comment', CommentSchema);
