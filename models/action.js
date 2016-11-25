const mongoose = require('../mongoose');
const uuid = require('uuid');
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
  user_id: String
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
 * Finds actions in an array of ids.
 * @param {String} ids array of user identifiers (uuid)
*/
ActionSchema.statics.findByItemIdArray = function(item_ids) {
  return Action.find({
    'item_id': {$in: item_ids}
  });
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
