const mongoose = require('../services/mongoose');
const Schema = mongoose.Schema;
const TagLinkSchema = require('./schema/tag_link');
const uuid = require('uuid');
const COMMENT_STATUS = require('./enum/comment_status');

/**
 * The Mongo schema for a Comment Status.
 * @type {Schema}
 */
const StatusSchema = new Schema({
  type: {
    type: String,
    enum: COMMENT_STATUS,
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
  asset_id: String,
  author_id: String,
  status_history: [StatusSchema],
  status: {
    type: String,
    enum: COMMENT_STATUS,
    default: 'NONE'
  },
  parent_id: String,
  
  // Tags are added by the self or by administrators.
  tags: [TagLinkSchema],

  // Additional metadata stored on the field.
  metadata: {
    default: {},
    type: Object
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Add the indexes for the id of the comment.
CommentSchema.index({
  'id': 1
}, {
  unique: true,
  background: false
});

// Comment model.
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
