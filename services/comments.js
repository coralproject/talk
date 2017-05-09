const CommentModel = require('../models/comment');
const ActionModel = require('../models/action');
const ActionsService = require('./actions');
const COMMENT_STATUS = require('../models/enum/comment_status');

module.exports = class CommentsService {

  /**
   * Creates a new Comment that came from a public source.
   * @param  {Mixed} comment either a single comment or an array of comments.
   * @return {Promise}
   */
  static publicCreate(comment) {

    // Check to see if this is an array of comments, if so map it out.
    if (Array.isArray(comment)) {
      return Promise.all(comment.map(CommentsService.publicCreate));
    }

    const {
      status = 'NONE',
    } = comment;

    comment.status_history = status ? [{
      type: status,
      created_at: new Date()
    }] : [];

    let commentModel = new CommentModel(comment);

    return commentModel.save();
  }

  static addTag(id, tagLink, verifyOwnership = false) {

    // Compose the query to find the comment.
    const query = {
      id,
      'tags.tag.name': {
        $ne: tagLink.tag.name
      }
    };

    // If ownership verification is required, ensure that the person that is
    // assigning the tag is the same person that owns the comment.
    if (verifyOwnership) {
      query['author_id'] = tagLink.assigned_by;
    }

    return CommentModel.update(query, {
      $push: {
        tags: tagLink
      }
    });
  }

  static removeTag(id, {tag: {name}, assigned_by}, verifyOwnership = false) {

    // Compose the query to find the comment that has the id: `id` and a tag
    // that has the name: `name`.
    const query = {
      id,
      'tags.tag.name': {
        $eq: name
      }
    };

    // If ownership verification is required, ensure that the person that is
    // assigning the tag is the same person that owns the comment.
    if (verifyOwnership) {
      query['author_id'] = assigned_by;
    }

    return CommentModel.update(query, {
      $pull: {
        tags: {
          name
        }
      }
    });
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
      .then((actions) => actions.map(a => a.item_id));
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
   * Find comments that need to be moderated (aka moderation queue).
   * @param {String} asset_id
   * @return {Promise}
   */
  static moderationQueue(status = 'NONE', asset_id = null) {

    // Fetch the comments with statuses.
    let comments = CommentModel.find({status});

    if (asset_id) {
      comments = comments.where({asset_id});
    }

    return comments;
  }

  /**
   * Pushes a new status in for the user.
   * @param {String} id          identifier of the comment  (uuid)
   * @param {String} status      the new status of the comment
   * @param {String} assigned_by the user id for the user who performed the
   *                             moderation action
   * @return {Promise}
   */
  static pushStatus(id, status, assigned_by = null) {

    // Check to see if the comment status is in the allowable set of statuses.
    if (COMMENT_STATUS.indexOf(status) === -1) {

      // Comment status is not supported! Error out here.
      return Promise.reject(new Error(`status ${status} is not supported`));
    }

    return CommentModel.findOneAndUpdate({id}, {
      $push: {
        status_history: {
          type: status,
          created_at: new Date(),
          assigned_by
        }
      },
      $set: {status}
    });
  }

  /**
   * Add an action to the comment.
   * @param {String} item_id  identifier of the comment  (uuid)
   * @param {String} user_id  user id of the action (uuid)
   * @param {String} action the new action to the comment
   * @return {Promise}
   */
  static addAction(item_id, user_id, action_type, metadata) {
    return ActionsService.insertUserAction({
      item_id,
      item_type: 'COMMENTS',
      user_id,
      action_type,
      metadata
    });
  }

  /**
   * Change the status of a comment.
   * @param {String} id  identifier of the comment  (uuid)
   * @param {String} status the new status of the comment
   * @return {Promise}
   */
  static removeById(id) {
    return CommentModel.remove({id});
  }

  /**
   * Remove an action from the comment.
   * @param {String} id  identifier of the comment  (uuid)
   * @param {String} action_type the type of the action to be removed
   * @param {String} user_id the id of the user performing the action
   * @return {Promise}
   */
  static removeAction(item_id, user_id, action_type) {
    return ActionModel.remove({
      action_type,
      item_type: 'COMMENTS',
      item_id,
      user_id
    });
  }

  /**
   * Returns all the comments in the collection.
   * @return {Promise}
   */
  static all() {
    return CommentModel.find({});
  }

  /**
   * Returns all the comments by user
   * probably to be paginated at some point in the future
   * @return {Promise} array resolves to an array of comments by that user
   */
  static findByUserId(author_id, admin = false) {

    // do not return un-published comments for non-admins
    let query = {author_id};

    if (!admin) {
      query.$nor = [{status: 'PREMOD'}, {status: 'REJECTED'}];
    }

    return CommentModel.find(query);
  }
};
