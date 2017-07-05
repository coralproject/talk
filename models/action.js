const mongoose = require('../services/mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;
const ACTION_TYPES = require('./enum/action_types');
const ITEM_TYPES = require('./enum/item_types');

const ActionSchema = new Schema({
  id: {
    type: String,
    default: uuid.v4,
    unique: true
  },
  action_type: {
    type: String,
    enum: ACTION_TYPES
  },
  item_type: {
    type: String,
    enum: ITEM_TYPES
  },
  item_id: String,
  user_id: String,

  // The element that summaries will additionally group on in addtion to their action_type, item_type, and
  // item_id.
  group_id: String,

  // Additional metadata stored on the field.
  metadata: Schema.Types.Mixed
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Action = mongoose.model('Action', ActionSchema);

module.exports = Action;
