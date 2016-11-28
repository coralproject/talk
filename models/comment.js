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
 * @return {Promise}
 */
CommentSchema.statics.findById = function(id) {
  return Comment.findOne({'id': id});
};

/**
 * Finds ALL the comments by the asset_id.
 * @param {String} asset_id  identifier of the asset which owns this comment (uuid)
 * @return {Promise}
 */
CommentSchema.statics.findByAssetId = function(asset_id) {
  return Comment.find({asset_id});
};

/**
 * Finds the accepted comments by the asset_id.
 *  get the comments that are accepted.
 * @param {String} asset_id  identifier of the asset which owns the comments (uuid)
 * @return {Promise}
 */
CommentSchema.statics.findAcceptedByAssetId = function(asset_id) {
  return Comment.find({asset_id: asset_id, status:'accepted'});
};

/**
 * Finds the new and accepted comments by the asset_id.
 * @param {String} asset_id  identifier of the asset which owns the comments (uuid)
 * @return {Promise}
 */
CommentSchema.statics.findAcceptedAndNewByAssetId = function(asset_id) {
  return Comment.find({asset_id: asset_id, status: {'$in': ['accepted', '']}});
};

/**
 * Find comments by an action that was performed on them.
 * @param {String} action_type the type of action that was performed on the comment
 * @return {Promise}
 */
CommentSchema.statics.findByActionType = function(action_type) {
  return Action
    .findCommentsIdByActionType(action_type, 'comment')
    .then((actions) => {
      return Comment.find({'id': {'$in': actions.map(function(a){
        return a.item_id;})}
      });
    });
};

/**
 * Find not moderated comments by an action that was performed on them.
 * @param {String} action_type the type of action that was performed on the comment
 * @param {String} status the status of the comment to search for
 * @return {Promise}
 */
CommentSchema.statics.findByStatusByActionType = function(status, action_type) {
  return Action
    .findCommentsIdByActionType(action_type, 'comment')
    .then((actions) => {
      return Comment.find({
        status: status,
        id: {
          $in: actions.map(a => a.item_id)
        }
      });
    });
};

/**
 * Find comments by their status.
 * @param {String} status the status of the comment to search for
 * @return {Promise}
 */
CommentSchema.statics.findByStatus = function(status) {
  return Comment.find({
    status: status === 'new' ? '' : status
  });
};

/**
 * Find comments that need to be moderated (aka moderation queue).
 * @param {String} moderationValue pre or post moderation setting. If it is undefined then look at the settings.
 * @return {Promise}
 */
CommentSchema.statics.moderationQueue = function(moderation) {
  switch(moderation){

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
    return Promise.reject(Error('Moderation setting not found.'));
  }
};

//==============================================================================
// Update Statics
//==============================================================================

/**
 * Changes the status of a comment.
 * @param {String} id  identifier of the comment  (uuid)
 * @param {String} status the new status of the comment
 * @return {Promise}
 */
CommentSchema.statics.changeStatus = function(id, status) {
  return Comment.findOneAndUpdate({'id': id}, {$set: {'status': status}}, {upsert: false, new: true})
    .then((comment) => {
      return comment;
    });
};

/**
 * Add an action to the comment.
 * @param {String} item_id  identifier of the comment  (uuid)
 * @param {String} user_id  user id of the action (uuid)
 * @param {String} action the new action to the comment
 * @return {Promise}
 */
CommentSchema.statics.addAction = (item_id, user_id, action_type) => Action.insertUserAction({
  item_id,
  item_type: 'comment',
  user_id,
  action_type
});

//==============================================================================
// Remove Statics
//==============================================================================

/**
 * Change the status of a comment.
 * @param {String} id  identifier of the comment  (uuid)
 * @param {String} status the new status of the comment
 * @return {Promise}
 */
CommentSchema.statics.removeById = function(id) {
  return Comment.remove({'id': id});
};

/**
 * Remove an action from the comment.
 * @param {String} id  identifier of the comment  (uuid)
 * @param {String} action_type the type of the action to be removed
 * @param {String} user_id the id of the user performing the action
 * @return {Promise}
 */
CommentSchema.statics.removeAction = function(item_id, user_id, action_type) {
  return Action.remove({
    action_type,
    item_type: 'comment',
    item_id,
    user_id
  });
};

/**
 * Returns all the comments in the collection.
 * @return {Promise}
 */
CommentSchema.statics.all = () => {
  return Comment.find();
};

// Comment model.
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
