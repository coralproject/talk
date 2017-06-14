const ActionModel = require('../models/action');
const _ = require('lodash');
const errors = require('../errors');

module.exports = class ActionsService {

  /**
   * Finds an action by the id.
   * @param {String} id  identifier of the action (uuid)
  */
  static findById(id) {
    return ActionModel.findOne({id});
  }

  /**
   * Inserts an action.
   * @param {String} item_id  identifier of the item (uuid)
   * @param {String} user_id  user id of the action (uuid)
   * @param {String} action   the new action to the item
   * @return {Promise}
   */
  static insertUserAction(action) {

    // Actions are made unique by using a query that can be reproducable, i.e.,
    // not containing user inputable values.
    let query = {
      action_type: action.action_type,
      item_type: action.item_type,
      item_id: action.item_id,
      user_id: action.user_id,
      group_id: action.group_id
    };

    // Create/Update the action.
    return new Promise((resolve, reject) => {
      ActionModel.findOneAndUpdate(
        query, {

          // Only set when not existing.
          $setOnInsert: action,
        }, {

          // Ensure that if it's new, we return the new object created.
          new: true,

          // Use raw result to get `updatedExisting`.
          passRawResult: true,

          // Perform an upsert in the event that this doesn't exist.
          upsert: true,

          // Set the default values if not provided based on the mongoose models.
          setDefaultsOnInsert: true
        }, (err, doc, raw) => {
          if (err) { return reject(err); }
          if (raw.lastErrorObject.updatedExisting) {
            return reject(new errors.ErrAlreadyExists(raw.value));
          }
          return resolve(raw.value);
        });
    });
  }

  /**
   * Finds actions in an array of ids.
   * @param {String} ids array of user identifiers (uuid)
  */
  static async findByItemIdArray(item_ids) {
    let actions = await ActionModel.find({
      'item_id': {$in: item_ids}
    });

    if (actions === null) {
      return [];
    }

    return actions;
  }

  /**
   * Fetches the action summaries for the given asset, and comments around the
   * given user id.
   * @param  {[type]} asset_id             [description]
   * @param  {[type]} comments             [description]
   * @param  {String} [current_user_id=''] [description]
   * @return {[type]}                      [description]
   */
  static getActionSummariesFromComments(asset_id = '', comments, current_user_id = '') {

    // Get the user id's from the author id's as a unique array that gets
    // sorted.
    let userIDs = _.uniq(comments.map((comment) => comment.author_id)).sort();

    // Fetch the actions for pretty much everything at this point.
    return ActionsService.getActionSummaries(_.uniq([

      // Actions can be on assets...
      asset_id,

      // Comments...
      ...comments.map((comment) => comment.id),

      // Or Authors...
      ...userIDs
    ].filter((e) => e)), current_user_id);
  }

  /**
   * Returns summaries of actions for an array of ids
   * @param {String} ids array of user identifiers (uuid)
  */
  static getActionSummaries(item_ids, current_user_id = '') {

    // only grab items that match the specified item id's
    let $match = {
      item_id: {
        $in: item_ids
      }
    };

    let $group = {

      // group unique documents by these properties, we are leveraging the
      // fact that each uuid is completly unique.
      _id: {
        item_id: '$item_id',
        action_type: '$action_type',
        group_id: '$group_id'
      },

      // and sum up all actions matching the above grouping criteria
      count: {
        $sum: 1
      },

      // we are leveraging the fact that each uuid is completly unique and
      // just grabbing the last instance of the item type here.
      item_type: {
        $first: '$item_type'
      },

      current_user: {
        $max: {
          $cond: {
            if: {
              $eq: ['$user_id', current_user_id],
            },
            then: '$$CURRENT',
            else: null
          }
        }
      }
    };

    let $project = {

      // suppress the _id field
      _id: false,

      // map the fields from the _id grouping down a level
      item_id: '$_id.item_id',
      action_type: '$_id.action_type',
      group_id: '$_id.group_id',

      // map the field directly
      count: '$count',
      item_type: '$item_type',

      // set the current user to false here
      current_user: '$current_user'
    };

    return ActionModel.aggregate([
      {$match},
      {$group},
      {$project}
    ]);
  }

  /*
   * Finds all comments for a specific action.
   * @param {String} action_type type of action
   * @param {String} item_type type of item the action is on
  */
  static findByType(action_type, item_type) {
    return ActionModel.find({
      'action_type': action_type,
      'item_type': item_type
    });
  }

  /**
   * Finds all comments ids for a specific action.
   * @param {String} action_type type of action
   * @param {String} item_type type of item the action is on
  */
  static findCommentsIdByActionType(action_type, item_type) {
    return ActionModel.find({
      'action_type': action_type,
      'item_type': item_type
    }, 'item_id');
  }
};
