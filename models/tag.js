const mongoose = require('../services/mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

// in settings
// --> decide who can apply them (self, role, anyone) and

// Who can see the tag (self, by role, anyone)
const PRIVACY_TYPES = [
  'ADMIN',
  'SELF',
  'PUBLIC'
];

// The type of item that the tag is apply on.
const ITEM_TYPES = [
  'ASSETS',
  'COMMENTS',
  'USERS'
];

/**
 * The Mongo schema for a Comment Tag.
 * @type {Schema}
 */
const TagSchema = new Schema({
  id: {
    type: String,
    default: uuid.v4,
    unique: true
  },

  name: {
    type: String,
  },

  item_type: {
    type: String,
    enum: ITEM_TYPES
  },

  item_id: String,

  // The User ID of the user that assigned the status.
  assigned_by: {
    type: String,
    default: null
  },

  privacy_type: {
    type: String,
    enum: PRIVACY_TYPES,
    default: 'SELF'
  },

  // Additional metadata stored on the field.
  metadata: Schema.Types.Mixed
},  {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Add the indixies on the tag on an item.
TagSchema.index({
  'item_type': 1,
  'item_id': 1,
  'name': 1
}, {
  unique: true,
  background: false
});

const Tag = mongoose.model('Tag', TagSchema);

module.exports = Tag;
