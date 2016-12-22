const mongoose = require('../services/mongoose');
const uuid = require('uuid');
const _ = require('lodash');
const Schema = mongoose.Schema;

const ActionSchema = new Schema({
  id: {
    type: String,
    default: uuid.v4,
    unique: true
  },
  action_type: String,
  item_type: String,
  item_id: String,
  user_id: String,
  metadata: Object, //Holds arbitrary metadata about the action.
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

/**
 * Finds an action by the id.
 * @param {String} id  identifier of the action (uuid)
*/
ActionSchema.statics.findById = function(id) {
  return Action.findOne({id});
};

/**
 * Add an action.
 * @param {String} item_id  identifier of the comment  (uuid)
 * @param {String} user_id  user id of the action (uuid)
 * @param {String} action the new action to the comment
 * @return {Promise}
 */
ActionSchema.statics.insertUserAction = (action) => {

  // Create/Update the action.
  return Action.findOneAndUpdate(action, action, {

    // Ensure that if it's new, we return the new object created.
    new: true,

    // Perform an upsert in the event that this doesn't exist.
    upsert: true,

    // Set the default values if not provided based on the mongoose models.
    setDefaultsOnInsert: true
  });
};

/**
 * Finds actions in an array of ids.
 * @param {String} ids array of user identifiers (uuid)
*/
ActionSchema.statics.findByItemIdArray = function(item_ids) {
  return Action.find({
    'item_id': {$in: item_ids}
  });
};

/**
 * Fetches the action summaries for the given asset, and comments around the
 * given user id.
 * @param  {[type]} asset_id             [description]
 * @param  {[type]} comments             [description]
 * @param  {String} [current_user_id=''] [description]
 * @return {[type]}                      [description]
 */
ActionSchema.statics.getActionSummariesFromComments = (asset_id = '', comments, current_user_id = '') => {

  // Get the user id's from the author id's as a unique array that gets
  // sorted.
  let userIDs = _.uniq(comments.map((comment) => comment.author_id)).sort();

  // Fetch the actions for pretty much everything at this point.
  return Action.getActionSummaries(_.uniq([

    // Actions can be on assets...
    asset_id,

    // Comments...
    ...comments.map((comment) => comment.id),

    // Or Authors...
    ...userIDs
  ].filter((e) => e)), current_user_id);
};

/**
 * Returns summaries of actions for an array of ids
 * @param {String} ids array of user identifiers (uuid)
*/
ActionSchema.statics.getActionSummaries = function(item_ids, current_user_id = '') {
  return Action.aggregate([
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
  ])
  .exec();
};

/*
 * Finds all comments for a specific action.
 * @param {String} action_type type of action
 * @param {String} item_type type of item the action is on
*/
ActionSchema.statics.findByType = function(action_type, item_type) {
  return Action.find({
    'action_type': action_type,
    'item_type': item_type
  });
};

/**
 * Finds all comments ids for a specific action.
 * @param {String} action_type type of action
 * @param {String} item_type type of item the action is on
*/
ActionSchema.statics.findCommentsIdByActionType = function(action_type, item_type) {
  return Action.find({
    'action_type': action_type,
    'item_type': item_type
  }, 'item_id');
};

const Action = mongoose.model('Action', ActionSchema);

module.exports = Action;
