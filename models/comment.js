const mongoose = require('../services/mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');
const uuid = require('uuid');
const Action = require('./action');

/**
 * The Mongo schema for a Comment Status.
 * @type {Schema}
 */
const StatusSchema = new Schema({
  type: {
    type: String,
    enum: [
      'accepted',
      'rejected',
      'premod',
    ],
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
  status: {type: String, default: null},
  parent_id: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

/**
 * toJSON overrides to remove fields from the json
 * output.
 */
CommentSchema.options.toJSON = {};
CommentSchema.options.toJSON.virtuals = true;
CommentSchema.options.toJSON.hide = '_id';
CommentSchema.options.toJSON.transform = (doc, ret, options) => {
  if (options.hide) {
    options.hide.split(' ').forEach((prop) => {
      delete ret[prop];
    });
  }

  return ret;
};

/**
 * Filters the object for the given user only allowing those with the allowed
 * roles/permissions to access particular parameters.
 */
CommentSchema.method('filterForUser', function(user = false) {
  if (!user || !user.roles.includes('admin')) {
    return _.pick(this.toJSON(), ['id', 'body', 'asset_id', 'author_id', 'parent_id', 'status']);
  }

  return this.toJSON();
});

/**
 * Creates a new Comment that came from a public source.
 * @param  {Mixed} comment either a single comment or an array of comments.
 * @return {Promise}
 */
CommentSchema.statics.publicCreate = (comment) => {

  // Check to see if this is an array of comments, if so map it out.
  if (Array.isArray(comment)) {
    return Promise.all(comment.map(Comment.publicCreate));
  }

  const {
    body,
    asset_id,
    parent_id,
    status = null,
    author_id
  } = comment;

  comment = new Comment({
    body,
    asset_id,
    parent_id,
    status_history: status ? [{
      type: status,
      created_at: new Date()
    }] : [],
    status,
    author_id
  });

  return comment.save();
};

/**
 * Finds a comment by the id.
 * @param {String} id  identifier of comment (uuid)
 * @return {Promise}
 */
CommentSchema.statics.findById = (id) => Comment.findOne({id});

/**
 * Finds ALL the comments by the asset_id.
 * @param {String} asset_id  identifier of the asset which owns this comment (uuid)
 * @return {Promise}
 */
CommentSchema.statics.findByAssetId = (asset_id) => Comment.find({
  asset_id
});

/**
 * Finds the accepted comments by the asset_id get the comments that are
 * accepted.
 * @param {String} asset_id  identifier of the asset which owns the comments (uuid)
 * @return {Promise}
 */
CommentSchema.statics.findAcceptedByAssetId = (asset_id) => Comment.find({
  asset_id,
  status: 'accepted'
});

/**
 * Finds the new and accepted comments by the asset_id.
 * @param {String} asset_id  identifier of the asset which owns the comments (uuid)
 * @return {Promise}
 */
CommentSchema.statics.findAcceptedAndNewByAssetId = (asset_id) => Comment.find({
  asset_id,
  $or: [
    {status: 'accepted'},
    {status: null}
  ]
});

/**
 * Find comments by an action that was performed on them.
 * @param {String} action_type the type of action that was performed on the comment
 * @return {Promise}
 */
CommentSchema.statics.findByActionType = (action_type) => Action
  .findCommentsIdByActionType(action_type, 'comment')
  .then((actions) => Comment.find({
    id: {
      $in: actions.map((a) => a.item_id)
    }
  }));

/**
 * Find comment id's where the action type matches the argument.
 * @param {String} action_type the type of action that was performed on the comment
 * @return {Promise}
 */
CommentSchema.statics.findIdsByActionType = (action_type) => Action
  .findCommentsIdByActionType(action_type, 'comments')
  .then((actions) => actions.map(a => a.item_id));

/**
 * Find comments by current status
 * @param {String} status status of the comment to search for
 * @return {Promise} resovles to comment array
 */
CommentSchema.statics.findByStatus = (status = null) => {
  return Comment.find({status});
};

/**
 * Find comments that need to be moderated (aka moderation queue).
 * @param {String} asset_id
 * @return {Promise}
 */
CommentSchema.statics.moderationQueue = (status, asset_id = null) => {

  /**
   * This adds the asset_id requirement to the query if the asset_id is defined.
   */
  const assetIDWrap = (query) => {
    if (asset_id) {
      query = query.where('asset_id', asset_id);
    }

    return query;
  };

  // Pre-moderation:  New comments are shown in the moderator queues immediately.
  let comments = assetIDWrap(Comment.findByStatus(status));

  return comments;
};

/**
 * Pushes a new status in for the user.
 * @param {String} id          identifier of the comment  (uuid)
 * @param {String} status      the new status of the comment
 * @param {String} assigned_by the user id for the user who performed the
 *                             moderation action
 * @return {Promise}
 */
CommentSchema.statics.pushStatus = (id, status, assigned_by = null) => Comment.update({id}, {
  $push: {
    status_history: {
      type: status,
      created_at: new Date(),
      assigned_by
    }
  },
  $set: {status}
});

/**
 * Add an action to the comment.
 * @param {String} item_id  identifier of the comment  (uuid)
 * @param {String} user_id  user id of the action (uuid)
 * @param {String} action the new action to the comment
 * @return {Promise}
 */
CommentSchema.statics.addAction = (item_id, user_id, action_type, metadata) => Action.insertUserAction({
  item_id,
  item_type: 'comments',
  user_id,
  action_type,
  metadata
});

/**
 * Change the status of a comment.
 * @param {String} id  identifier of the comment  (uuid)
 * @param {String} status the new status of the comment
 * @return {Promise}
 */
CommentSchema.statics.removeById = (id) => Comment.remove({id});

/**
 * Remove an action from the comment.
 * @param {String} id  identifier of the comment  (uuid)
 * @param {String} action_type the type of the action to be removed
 * @param {String} user_id the id of the user performing the action
 * @return {Promise}
 */
CommentSchema.statics.removeAction = (item_id, user_id, action_type) => Action.remove({
  action_type,
  item_type: 'comment',
  item_id,
  user_id
});

/**
 * Returns all the comments in the collection.
 * @return {Promise}
 */
CommentSchema.statics.all = () => Comment.find();

/**
 * Returns all the comments by user
 * probably to be paginated at some point in the future
 * @return {Promise} array resolves to an array of comments by that user
 */
CommentSchema.statics.findByUserId = function (author_id) {
  return Comment.find({author_id});
};

// Comment model.
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
