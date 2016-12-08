const mongoose = require('../mongoose');
const Schema = mongoose.Schema;
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
  status: [StatusSchema],
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
CommentSchema.options.toJSON.hide = '_id status';
CommentSchema.options.toJSON.transform = (doc, ret, options) => {
  if (options.hide) {
    options.hide.split(' ').forEach((prop) => {
      delete ret[prop];
    });
  }

  return ret;
};

/**
 * toJSON overrides to remove fields from the json
 * output.
 */
CommentSchema.options.toJSON = {};
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
 * Sets up a virtual getter function on a comment such that when you try and
 * access the `comment.last_status` it returns the last status in the array
 * of status's on the comment, or `null` if there was no status.
 */
CommentSchema.virtual('last_status').get(function() {
  if (this.status && this.status.length > 0) {
    return this.status[this.status.length - 1].type;
  }

  return null;
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
    status = false,
    author_id
  } = comment;

  comment = new Comment({
    body,
    asset_id,
    parent_id,
    status: status ? [{
      type: status,
      created_at: new Date()
    }] : [],
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
  'status.type': 'accepted'
});

/**
 * Finds the new and accepted comments by the asset_id.
 * @param {String} asset_id  identifier of the asset which owns the comments (uuid)
 * @return {Promise}
 */
CommentSchema.statics.findAcceptedAndNewByAssetId = (asset_id) => Comment.find({
  asset_id,
  $or: [
    {
      'status.type': 'accepted'
    },
    {
      status: {
        $size: 0
      }
    }
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
  .findCommentsIdByActionType(action_type, 'comment')
  .then((actions) => actions.map(a => a.item_id));

/**
 * Find comments by their status.
 * @param {String} status the status of the comment to search for
 * @return {Promise}
 */
CommentSchema.statics.findByStatus = (status = false) => {
  let q = {};

  if (status) {
    q['status.type'] = status;
  } else {
    q.status = {$size: 0};
  }

  return Comment.find(q);
};

/**
 * Find comments that need to be moderated (aka moderation queue).
 * @param {String} moderationValue pre or post moderation setting. If it is undefined then look at the settings.
 * @return {Promise}
 */
CommentSchema.statics.moderationQueue = (moderation, asset_id = false) => {

  /**
   * This adds the asset_id requirement to the query if the asset_id is defined.
   */
  const assetIDWrap = (query) => {
    if (asset_id) {
      query = query.where('asset_id', asset_id);
    }

    return query;
  };

  // Decide on whether or not we need to load extended options for the
  // moderation based on the moderation options.
  let comments;

  if (moderation === 'pre') {

    // Pre-moderation:  New comments are shown in the moderator queues immediately.
    comments = assetIDWrap(CommentSchema.statics.findByStatus('premod'));

  } else {

    // Post-moderation: New comments do not appear in moderation queues unless they are flagged by other users.
    comments = CommentSchema.statics.findIdsByActionType('flag')
      .then((ids) => assetIDWrap(Comment.find({
        id: {
          $in: ids
        }
      })));
  }

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
    status: {
      type: status,
      created_at: new Date(),
      assigned_by
    }
  }
});

/**
 * Add an action to the comment.
 * @param {String} item_id  identifier of the comment  (uuid)
 * @param {String} user_id  user id of the action (uuid)
 * @param {String} action the new action to the comment
 * @return {Promise}
 */
CommentSchema.statics.addAction = (item_id, user_id, action) => Action.insertUserAction({
  item_id,
  item_type: 'comment',
  user_id,
  action
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

// Comment model.
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
