const CommentModel = require('../models/comment');
const ActionModel = require('../models/action');
const ActionsService = require('./actions');
const COMMENT_STATUS = require('../models/enum/comment_status');

const {ErrEditWindowHasEnded} = require('../errors');

// const ALLOWED_TAGS = [
//   {name: 'STAFF'},
//   {name: 'BEST'},
// ];

const STATUSES = [
  'ACCEPTED',
  'REJECTED',
  'PREMOD',
  'NONE',
];

const EDIT_WINDOW_MS = 30 * 1000; // 30 seconds

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

    return commentModel.save();
  }

  /**
   * Edit a Comment
   * @param {String} id    comment.id you want to edit (or its ID)
   * @param {String} asset_id   asset_id of the comment
   * @param {String} editor     user.id of the user trying to edit the comment (will err if not comment author)
   * @param {String} body       the new Comment body
   * @param {String} status     the new Comment status
   */
  static async edit(id, asset_id, editor, {body, status, ignoreEditWindow}) {
    if (status && ! STATUSES.includes(status)) {
      throw new Error(`status ${status} is not supported`);
    }
    const lastEditableCommentCreatedAt = new Date((new Date()).getTime() - EDIT_WINDOW_MS);
    const filter = Object.assign(
      {
        id,
        asset_id,
        author_id: editor,
      },
      ignoreEditWindow ? {} : {
        created_at: {
          $gt: lastEditableCommentCreatedAt,
        },
      }
    );
    const {nModified} = await CommentModel.update(
      filter,
      {
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
      }
    );
    switch (nModified) {
    case 0: {

          // disambiguate possible error cases
      const comment = await this.findById(id);

          // return whether the comment should no longer be editable
          // because its edit window expired
      const editWindowExpired = (comment) => {
        const now = new Date;
        const editableUntil = this.getEditableUntilDate(comment);
        return now > editableUntil;
      };
      if ( ! comment || (comment.asset_id !== asset_id)) {
        throw Object.assign(new Error('Comment not found'), {
          name: 'CommentNotFound'
        });
      } else if (comment.author_id !== editor) {
        throw Object.assign(new Error('You aren\'t allowed to edit that comment'), {
          name: 'NotAuthorizedToEdit'
        });
      } else if (( ! ignoreEditWindow) && editWindowExpired(comment)) {
        throw new ErrEditWindowHasEnded();
      }
      throw new Error('Failed to edit comment. This could be because it can\'t be found, the edit window expired, or because you\'re not allowed to edit it.');
    }
    }
  }

  /**
   * Until when can the provided comment be edited?
   * @param {Comment} comment - comment to check last edit date of
   * @returns {Date} last date at which comment can be edited
   */
  static getEditableUntilDate(comment) {
    const {created_at} = comment;
    return new Date(Number(created_at) + EDIT_WINDOW_MS);
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
  static addAction(item_id, user_id, action_type, metadata = {}) {
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
