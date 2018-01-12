const mongoose = require('../../services/mongoose');
const Schema = mongoose.Schema;

const ITEM_TYPES = require('../enum/item_types');
const USER_ROLES = require('../enum/user_roles');

/**
 * The Mongo schema for a Tag.
 * @type {Schema}
 */
const TagSchema = new Schema(
  {
    // The actual name of the tag.
    name: String,

    // Contains permission data.
    permissions: {
      // Determines if this tag is public or not.
      public: {
        type: Boolean,
        default: true,
      },

      // Determines if the owner of the Model can add/remove this tag on their own
      // resources.
      self: Boolean,

      // Determines other roles that are allowed to set this tag on other
      // resources.
      roles: [
        {
          type: String,
          enum: USER_ROLES,
          default: [],
        },
      ],
    },

    // A list of all the model types that this tag can be added to.
    models: [
      {
        type: String,
        enum: ITEM_TYPES,
      },
    ],

    // The date for when the tag was created.
    created_at: {
      type: Date,
      default: Date,
    },
  },
  {
    _id: false,
  }
);

module.exports = TagSchema;
