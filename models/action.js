const mongoose = require('../services/mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

const ACTION_TYPES = [
  'LIKE',
  'FLAG'
];

const ITEM_TYPES = [
  'ASSETS',
  'COMMENTS',
  'USERS'
];

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
  metadata: Schema.Types.Mixed
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Action = mongoose.model('Action', ActionSchema);

module.exports = Action;
