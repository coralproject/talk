const mongoose = require('../../services/mongoose');
const Schema = mongoose.Schema;
const TagSchema = require('./tag');

/**
 * The Mongo schema for linking a Tag to a Model.
 * @type {Schema}
 */
const TagLinkSchema = new Schema(
  {
    // A deep copy of the tag that is the origin for this link. If the ID matches
    // with existing tags in the global/asset context then content will be
    // substituted.
    tag: TagSchema,

    // The User ID of the user that assigned the status.
    assigned_by: {
      type: String,
      default: null,
    },

    // The date when the tag was added to the model.
    created_at: {
      type: Date,
      default: Date,
    },
  },
  {
    _id: false,
  }
);

module.exports = TagLinkSchema;
