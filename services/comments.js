const CommentModel = require('../models/comment');

const debug = require('debug')('talk:services:comments');
const ActionsService = require('./actions');
const SettingsService = require('./settings');

const sc = require('snake-case');
const cloneDeep = require('lodash/cloneDeep');
const errors = require('../errors');
const events = require('./events');
const {
  ACTIONS_NEW,
  ACTIONS_DELETE,
  COMMENTS_NEW,
  COMMENTS_EDIT,
} = require('./events/constants');

module.exports = class CommentsService {

  /**
   * Creates a new Comment that came from a public source.
   * @param  {Mixed} comment either a single comment or an array of comments.
   * @return {Promise}
   */
  static async publicCreate(comment) {

    // Check to see if this is an array of comments, if so map it out.
    if (Array.isArray(comment)) {
      return Promise.all(comment.map(CommentsService.publicCreate));
    }

    const {
      status = 'NONE',
    } = comment;

    const commentModel = new CommentModel(Object.assign({
      status_history: status ? [{
        type: status,
        created_at: new Date()
      }] : [],
      body_history: [{
        body: comment.body,
        created_at: new Date()
      }]
    }, comment));

    const savedCommentModel = await commentModel.save();

    // Emit that the comment was created!
    await events.emitAsync(COMMENTS_NEW, savedCommentModel);

    return savedCommentModel;
  }

  /**
   * lastUnmoderatedStatus will retrieve the last status before this one.
   *
   * @param {Object} comment the comment to get the last status of
   */
  static lastUnmoderatedStatus(comment) {
    const UNMODERATED_STATUSES = [
      'NONE',
      'PREMOD',
    ];

    for (let i = comment.status_history.length - 1; i >= 0; i--) {
      const {type} = comment.status_history[i];

      if (UNMODERATED_STATUSES.includes(type)) {
        return type;
      }
    }
  }

  /**
   * Edit a Comment.
   *
   * @param {String} id         comment.id you want to edit (or its ID)
   * @param {String} author_id  user.id of the user trying to edit the comment (will err if not comment author)
   * @param {String} body       the new Comment body
   * @param {String} status     the new Comment status
   */
  static async edit({id, author_id, body, status}) {
    const EDITABLE_STATUSES = ['NONE', 'PREMOD', 'ACCEPTED'];

    const query = {
      id,
      author_id,
      status: {
        $in: EDITABLE_STATUSES,
      },
    };

    // Establish the edit window (if it exists) and add the condition to the
    // original query.
    const {editCommentWindowLength: editWindowMs} = await SettingsService.retrieve();
    const lastEditableCommentCreatedAt = new Date(Date.now() - editWindowMs);
    query.created_at = {
      $gt: lastEditableCommentCreatedAt,
    };

    const originalComment = await CommentModel.findOneAndUpdate(query, {
      $set: {
        body,
        status,
      },
      $push: {
        body_history: {
          body,
          created_at: new Date(),
        },
        status_history: {
          type: status,
          created_at: new Date(),
        }
      },
    });

    if (originalComment == null) {

      // Try to get the comment.
      const comment = await CommentsService.findById(id);
      if (comment == null) {
        debug('rejecting comment edit because comment was not found');
        throw errors.ErrNotFound;
      }

      // Check to see if the user was't allowed to edit it.
      if (comment.author_id !== author_id) {
        debug('rejecting comment edit because author id does not match editing user');
        throw errors.ErrNotAuthorized;
      }

      // Check to see if the comment had a status that was editable.
      if (!EDITABLE_STATUSES.includes(comment.status)) {
        debug('rejecting comment edit because original comment has a non-editable status');
        throw errors.ErrNotAuthorized;
      }

      // Check to see if the edit window expired.
      if (comment.created_at <= lastEditableCommentCreatedAt) {
        debug('rejecting comment edit because outside edit time window');
        throw errors.ErrEditWindowHasEnded;
      }

      throw new Error('comment edit failed for an unexpected reason');
    }

    // Mutate the comment like Mongo would have.
    const editedComment = cloneDeep(originalComment);
    editedComment.status = status;
    editedComment.body = body;
    editedComment.body_history.push({
      body,
      created_at: new Date(),
    });
    editedComment.status_history.push({
      type: status,
      created_at: new Date(),
    });

    // We should adjust the comment's status such that if it was approved
    // previously, we should mark the comment as 'NONE' or 'PREMOD', which ever
    // was most recent if the new comment is destined to be `NONE` or `PREMOD`.
    if (originalComment.status === 'ACCEPTED' && status === 'NONE') {

      const lastUnmoderatedStatus = CommentsService.lastUnmoderatedStatus(originalComment);

      // If the last moderated status was found and the current comment doesn't
      // match this already.
      if (lastUnmoderatedStatus && status !== lastUnmoderatedStatus) {

        // Update the comment model (if at this point, the status is still
        // accepted) with the previously unmoderated status
        await CommentModel.update({
          id,
          status,
        }, {
          $set: {
            status: lastUnmoderatedStatus,
          },
          $push: {
            status_history: {
              type: lastUnmoderatedStatus,
              created_at: new Date(),
            }
          },
        });

        // Update the returned comment.
        editedComment.status = lastUnmoderatedStatus;
        editedComment.status_history.push({
          type: lastUnmoderatedStatus,
          created_at: new Date(),
        });
      }
    }

    await events.emitAsync(COMMENTS_EDIT, originalComment, editedComment);

    return editedComment;
  }

  /**
   * Finds a comment by the id.
   * @param {String} id  identifier of comment (uuid)
   * @return {Promise}
   */
  static findById(id) {
    return CommentModel.findOne({id});
  }

  /**
   * Finds ALL the comments by the asset_id.
   * @param {String} asset_id  identifier of the asset which owns this comment (uuid)
   * @return {Promise}
   */
  static findByAssetId(asset_id) {
    return CommentModel.find({
      asset_id
    });
  }

  /**
   * findByAssetIdWithStatuses finds all the comments where the asset id matches
   * what's provided and the status is one of the ones listed in the statuses
   * array.
   * @param {String} asset_id      the asset id to search by
   * @param {Array}  [statuses=[]] the array of statuses to search by
   * @return {Promise}             resolves to an array of comments
   */
  static findByAssetIdWithStatuses(asset_id, statuses = []) {
    return CommentModel.find({
      asset_id,
      status: {
        $in: statuses
      }
    });
  }

  /**
   * Find comments by an action that was performed on them.
   * @param {String} action_type the type of action that was performed on the comment
   * @return {Promise}
   */
  static findByActionType(action_type) {
    return ActionsService
      .findCommentsIdByActionType(action_type, 'COMMENTS')
      .then((actions) => CommentModel.find({
        id: {
          $in: actions.map((a) => a.item_id)
        }
      }));
  }

  /**
   * Find comment id's where the action type matches the argument.
   * @param {String} action_type the type of action that was performed on the comment
   * @return {Promise}
   */
  static findIdsByActionType(action_type) {
    return ActionsService
      .findCommentsIdByActionType(action_type, 'COMMENTS')
      .then((actions) => actions.map((a) => a.item_id));
  }

  /**
   * Find comments by current status
   * @param {String} status status of the comment to search for
   * @return {Promise} resovles to comment array
   */
  static findByStatus(status = 'NONE') {
    return CommentModel.find({status});
  }

  /**
   * Pushes a new status in for the user.
   * @param {String} id          identifier of the comment  (uuid)
   * @param {String} status      the new status of the comment
   * @param {String} assigned_by the user id for the user who performed the
   *                             moderation action
   * @return {Promise}
   */
  static async pushStatus(id, status, assigned_by = null) {
    const created_at = new Date();
    const originalComment = await CommentModel.findOneAndUpdate({id}, {
      $push: {
        status_history: {
          type: status,
          created_at,
          assigned_by,
        }
      },
      $set: {status}
    });

    if (originalComment == null) {
      throw errors.ErrNotFound;
    }

    const editedComment = new CommentModel(originalComment.toObject());
    editedComment.status_history.push({
      type: status,
      created_at,
      assigned_by,
    });
    editedComment.status = status;

    // Emit that the comment was edited, and pass the original comment and the
    // edited comment.
    await events.emitAsync(COMMENTS_EDIT, originalComment, editedComment);

    return editedComment;
  }

  /**
   * Add an action to the comment.
   * @param {String} item_id  identifier of the comment  (uuid)
   * @param {String} user_id  user id of the action (uuid)
   * @param {String} action the new action to the comment
   * @return {Promise}
   */
  static addAction(item_id, user_id, action_type, metadata = {}) {
    return ActionsService.create({
      item_id,
      item_type: 'COMMENTS',
      user_id,
      action_type,
      metadata
    });
  }
};

//==============================================================================
// Event Hooks
//==============================================================================

const incrActionCounts = async (action, value) => {
  const ACTION_TYPE = sc(action.action_type.toLowerCase());

  const update = {
    [`action_counts.${ACTION_TYPE}`]: value,
  };

  if (action.group_id && action.group_id.length > 0) {
    const GROUP_ID = sc(action.group_id.toLowerCase());

    update[`action_counts.${ACTION_TYPE}_${GROUP_ID}`] = value;
  }

  try {
    await CommentModel.update({
      id: action.item_id,
    }, {
      $inc: update,
    });
  } catch (err) {
    console.error(`Can't mutate the action_counts.${ACTION_TYPE}:`, err);
  }
};

// When a new action is created, modify the comment.
events.on(ACTIONS_NEW, async (action) => {
  if (!action || action.item_type !== 'COMMENTS') {
    return;
  }

  return incrActionCounts(action, 1);
});

// When an action is deleted, remove the action count on the comment.
events.on(ACTIONS_DELETE, async (action) => {
  if (!action || action.item_type !== 'COMMENTS') {
    return;
  }

  return incrActionCounts(action, -1);
});

const incrReplyCount = async (comment, value) => {
  try {
    await CommentModel.update({
      id: comment.parent_id,
    }, {
      $inc: {
        reply_count: value,
      },
    });
  } catch (err) {
    console.error('Can\'t mutate the reply count:', err);
  }
};

// When a comment is created, if it is a reply, increment the reply count on the
// parent's document.
events.on(COMMENTS_NEW, async (comment) => {
  if (
    !comment || // Check that the comment is defined.
    (!comment.parent_id || comment.parent_id.length === 0) || // Check that the comment has a parent (is a reply).
    !(comment.status === 'NONE' || comment.status === 'ACCEPTED') // Check that the comment is visible.
  ) {
    return;
  }

  return incrReplyCount(comment, 1);
});

// When a comment is edited, if the visability changed publicly, then modify the
// comment.
events.on(COMMENTS_EDIT, async (originalComment, editedComment) => {
  if (
    !editedComment || // Check that the comment is defined.
    (!editedComment.parent_id || editedComment.parent_id.length === 0) // Check that the comment has a parent (is a reply).
  ) {
    return;
  }

  // If the comment was visible before, and now it isn't, decrement the count;
  if (originalComment.visible && !editedComment.visible) {
    return incrReplyCount(editedComment, -1);
  }

  // If the comment was not visible before, and now it is, increment the count.
  if (!originalComment.visible && editedComment.visible) {
    return incrReplyCount(editedComment, 1);
  }
});
