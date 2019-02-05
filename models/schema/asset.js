const mongoose = require('../../services/mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');
const TagLinkSchema = require('./tag_link');
const { get } = require('lodash');

const Asset = new Schema(
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
    // the base settings from the base Settings object.
    settings: {
      default: {},
      type: Object,
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

Asset.index(
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

// Indexes for listing the assets on the admin page.
Asset.index({ created_at: -1, publication_date: -1 }, { background: true });
Asset.index({ created_at: 1, publication_date: 1 }, { background: true });

/**
 * Returns true if the asset is closed, false else.
 */
Asset.virtual('isClosed').get(function() {
  const closedAt = get(this, 'closedAt', null);
  if (closedAt === null) {
    return false;
  }

  return closedAt.getTime() <= new Date().getTime();
});

module.exports = Asset;
