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
  },
  'item_id'
  );
};

const Action = mongoose.model('Action', ActionSchema);

module.exports = Action;
