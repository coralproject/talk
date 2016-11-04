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
},{
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
 * Finds users in an array of ids.
 * @param {String} ids array of user identifiers (uuid)
*/
ActionSchema.statics.findByItemIdArray = function(item_ids) {
  return Action.find({
    'item_id': {$in: item_ids}
  });
};

const Action = mongoose.model('Action', ActionSchema);

module.exports = Action;
