const mongoose = require('../services/mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');
const TagLinkSchema = require('./schema/tag_link');

const AssetSchema = new Schema(
  {
    id: {
      type: String,
      default: uuid.v4,
      unique: true,
      index: true,
    },
    url: {
      type: String,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      default: 'assets',
    },
    scraped: {
      type: Date,
      default: null,
    },
    closedAt: {
      type: Date,
      default: null,
    },
    closedMessage: {
      type: String,
      default: null,
    },
    title: String,
    description: String,
    image: String,
    section: String,
    subsection: String,
    author: String,
    publication_date: Date,
    modified_date: Date,

    // This object is used exclusively for storing settings that are to override
    // the base settings from the base Settings object. This is to be accessed
    // always after running `rectifySettings` against it.
    settings: {
      type: Schema.Types.Mixed,
      default: {},
    },

    // Tags are added by the self or by administrators.
    tags: [TagLinkSchema],

    // Additional metadata stored on the field.
    metadata: {
      default: {},
      type: Object,
    },
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

AssetSchema.index(
  {
    title: 'text',
    url: 'text',
    description: 'text',
    section: 'text',
    subsection: 'text',
    author: 'text',
  },
  {
    background: true,
  }
);

/**
 * Returns true if the asset is closed, false else.
 */
AssetSchema.virtual('isClosed').get(function() {
  return Boolean(
    this.closedAt && this.closedAt.getTime() <= new Date().getTime()
  );
});

const Asset = mongoose.model('Asset', AssetSchema);

module.exports = Asset;
