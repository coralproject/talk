const ActionModel = require('../models/action');
const _ = require('lodash');

module.exports = class ActionsService {

  /**
   * Finds an action by the id.
   * @param {String} id  identifier of the action (uuid)
  */
  static findById(id) {
    return ActionModel.findOne({id});
  }

  /**
   * Add an action.
   * @param {String} item_id  identifier of the comment  (uuid)
   * @param {String} user_id  user id of the action (uuid)
   * @param {String} action the new action to the comment
   * @return {Promise}
   */
  static insertUserAction(action) {

    // Actions are made unique by using a query that can be reproducable, i.e.,
    // not containing user inputable values.
    let query = {
      action_type: action.action_type,
      item_type: action.item_type,
      item_id: action.item_id,
      user_id: action.user_id
    };

    // Create/Update the action.
    return ActionModel.findOneAndUpdate(query, action, {

      // Ensure that if it's new, we return the new object created.
      new: true,

      // Perform an upsert in the event that this doesn't exist.
      upsert: true,

      // Set the default values if not provided based on the mongoose models.
      setDefaultsOnInsert: true
    });
  }

  /**
   * Finds actions in an array of ids.
   * @param {String} ids array of user identifiers (uuid)
  */
  static findByItemIdArray(item_ids) {
    return ActionModel.find({
      'item_id': {$in: item_ids}
    });
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
    return ActionModel.aggregate([
      {

        // only grab items that match the specified item id's
        $match: {
          item_id: {
            $in: item_ids
          }
        }
      },
      {
        $group: {

          // group unique documents by these properties, we are leveraging the
          // fact that each uuid is completly unique.
          _id: {
            item_id: '$item_id',
            action_type: '$action_type'
          },

          // and sum up all actions matching the above grouping criteria
          count: {
            $sum: 1
          },

          // we are leveraging the fact that each uuid is completly unique and
          // just grabbing the last instance of the item type here.
          item_type: {
            $last: '$item_type'
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
        }
      },
      {
        $project: {

          // suppress the _id field
          _id: false,

          // map the fields from the _id grouping down a level
          item_id: '$_id.item_id',
          action_type: '$_id.action_type',

          // map the field directly
          count: '$count',
          item_type: '$item_type',

          // set the current user to false here
          current_user: '$current_user'
        }
      }
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
