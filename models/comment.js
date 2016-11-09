const mongoose = require('../mongoose');
const uuid = require('uuid');
const Action = require('./action');
const Setting = require('./setting');

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
  username: String,
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

//==============================================================================
// New Statics
//==============================================================================

/**
 * Create a comment.
 * @param {String} body  content of comment
*/
CommentSchema.statics.new = function(body, author_id, asset_id, parent_id, status, username) {
  let comment  = new Comment({body, author_id, asset_id, parent_id, status, username});
  return comment.save();
};

//==============================================================================
// Find Statics
//==============================================================================

/**
 * Finds a comment by the id.
 * @param {String} id  identifier of comment (uuid)
*/
CommentSchema.statics.findById = function(id) {
  return Comment.findOne({'id': id});
};

/**
 * Finds ALL the comments by the asset_id.
 * @param {String} asset_id  identifier of the asset which owns this comment (uuid)
*/
CommentSchema.statics.findByAssetId = function(asset_id) {
  return Comment.find({asset_id});
};

/**
 * Finds the accepted comments by the asset_id.
 *  get the comments that are accepted.
 * @param {String} asset_id  identifier of the asset which owns the comments (uuid)
*/
CommentSchema.statics.findAcceptedByAssetId = function(asset_id) {
  return Comment.find({asset_id: asset_id, status:'accepted'});
};

/**
 * Finds the new and accepted comments by the asset_id.
 * @param {String} asset_id  identifier of the asset which owns the comments (uuid)
*/
CommentSchema.statics.findNewByAssetId = function(asset_id) {
  return Comment.find({asset_id: asset_id, status: {'$in': ['accepted', '']}});
};

/**
 * Find comments by an action that was performed on them.
 * @param {String} action_type the type of action that was performed on the comment
*/
CommentSchema.statics.findByActionType = function(action_type) {
  return Action.findCommentsIdByActionType(action_type, 'comment').then((actions) => {
    return Comment.find({'id': {'$in': actions.map(function(a){return a.item_id;})}});
  });
};

/**
 * Find not moderated comments by an action that was performed on them.
 * @param {String} action_type the type of action that was performed on the comment
 * @param {String} status the status of the comment to search for
*/
CommentSchema.statics.findByStatusByActionType = function(status, action_type) {
  return Action.findCommentsIdByActionType(action_type, 'comment').then((actions) => {
    return Comment.find({'status': status, 'id': {'$in': actions.map(function(a){return a.item_id;})}});
  });
};

/**
 * Find comments by their status.
 * @param {String} status the status of the comment to search for
*/
CommentSchema.statics.findByStatus = function(status) {
  return Comment.find({'status': status});
};

/**
 * Find comments that need to be moderated (aka moderation queue).
 * @param {String} moderationValue pre or post moderation setting. If it is undefined then look at the settings.
*/
CommentSchema.statics.moderationQueue = function(moderationValue) {

  return Setting.getModerationSetting().then(function({moderation}){
    if (typeof moderationValue === 'undefined' || moderationValue === undefined) {
      moderationValue = moderation;
    }
    switch(moderationValue){
    // Pre-moderation:  New comments are shown in the moderator queues immediately.
    case 'pre':
      return Comment.findByStatus('').then((comments) => {
        return comments;
      });
    // Post-moderation: New comments do not appear in moderation queues unless they are flagged by other users.
    case 'post':
      return Comment.findByStatusByActionType('', 'flag').then((comments) => {
        return comments;
      });
    default:
      throw new Error('Moderation setting not found.');
    }
  });
};

//==============================================================================
// Update Statics
//==============================================================================

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

//==============================================================================
// Remove Statics
//==============================================================================

/**
 * Change the status of a comment.
 * @param {String} id  identifier of the comment  (uuid)
 * @param {String} status the new status of the comment
*/
CommentSchema.statics.removeById = function(id) {
  return Comment.remove({'id': id});
};

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
