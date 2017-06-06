const mongoose = require('../services/mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');

const STATUSES = [
  'ACCEPTED',
  'REJECTED',
  'PREMOD',
  'NONE'
];

/**
 * The Mongo schema for a Comment Status.
 * @type {Schema}
 */
const StatusSchema = new Schema({
  type: {
    type: String,
    enum: STATUSES,
  },

  // The User ID of the user that assigned the status.
  assigned_by: {
    type: String,
    default: null
  },

  created_at: Date
}, {
  _id: false
});

/**
 * The Mongo schema for a Comment Tag.
 * @type {Schema}
 */
const TagSchema = new Schema({
  name: String,

  // The User ID of the user that assigned the status.
  assigned_by: {
    type: String,
    default: null
  },

  created_at: {
    type: Date,
    default: Date
  }
}, {
  _id: false
});

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
  }
});

/**
 * The Mongo schema for a Comment.
 * @type {Schema}
 */
const CommentSchema = new Schema({
  id: {
    type: String,
    default: uuid.v4,
    unique: true
  },
  body: {
    type: String,
    required: [true, 'The body is required.'],
    minlength: 2
  },
  body_history: [BodyHistoryItemSchema],
  asset_id: String,
  author_id: String,
  status_history: [StatusSchema],
  status: {
    type: String,
    enum: STATUSES,
    default: 'NONE'
  },
  tags: [TagSchema],
  parent_id: String,

  // Additional metadata stored on the field.
  metadata: {
    default: {},
    type: Object
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  toJSON: {
    virtuals: true,
  },
});

CommentSchema.virtual('edited').get(function() {
  return this.body_history.length > 1;
});

// Comment model.
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
