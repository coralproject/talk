const mongoose = require('../mongoose');
const uuid = require('uuid');
const Action = require('./action');

const Schema = mongoose.Schema;

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
  status: {
    type: String,
    enum: ['accepted', 'rejected', ''],
    default: ''
  },
  parent_id: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

/**
 * Finds a comment by the id.
 * @param {String} id  identifier of comment (uuid)
*/
CommentSchema.statics.findById = function(id) {
  return Comment.findOne({'id': id});
};

/**
 * Finds a comment by the asset_id.
 * @param {String} asset_id  identifier of the asset which owns this comment (uuid)
*/
CommentSchema.statics.findByAssetId = function(asset_id) {
  return Comment.find({asset_id});
};

/**
 * Change the status of a comment.
 * @param {String} id  identifier of the comment  (uuid)
 * @param {String} status the new status of the comment
*/
CommentSchema.statics.changeStatus = function(id, status) {
  return Comment.findOneAndUpdate({'id': id}, {$set: {'status': status}}, {upsert: false, new: true});
};

/**
 * Add an action to the comment.
 * @param {String} id  identifier of the comment  (uuid)
 * @param {String} action the new action to the comment
*/
CommentSchema.statics.addAction = function(id, user_id, action_type) {
  // check that the comment exist
  let action  = new Action({
    action_type: action_type,
    item_type: 'comment',
    item_id: id,
    user_id: user_id
  });
  return action.save();
};

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
