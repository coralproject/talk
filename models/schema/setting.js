const mongoose = require('../../services/mongoose');
const Schema = mongoose.Schema;
const TagSchema = require('./tag');
const MODERATION_OPTIONS = require('../enum/moderation_options');

/**
 * Setting manages application settings that get used on front and backend.
 * @type {Schema}
 */
const Setting = new Schema(
  {
    id: {
      type: String,
      default: '1',
      unique: 1,
      index: true,
    },
    moderation: {
      type: String,
      enum: MODERATION_OPTIONS,
      default: 'POST',
    },
    infoBoxEnable: {
      type: Boolean,
      default: false,
    },
    customCssUrl: {
      type: String,
      default: '',
    },
    infoBoxContent: {
      type: String,
      default: '',
    },
    questionBoxEnable: {
      type: Boolean,
      default: false,
    },
    questionBoxIcon: {
      type: String,
      default: 'default',
    },
    questionBoxContent: {
      type: String,
      default: '',
    },
    premodLinksEnable: {
      type: Boolean,
      default: false,
    },
    organizationName: {
      type: String,
    },
    organizationContactEmail: {
      type: String,
    },
    autoCloseStream: {
      type: Boolean,
      default: false,
    },
    closedTimeout: {
      type: Number,

      // Two weeks default expiry.
      default: 60 * 60 * 24 * 7 * 2,
    },
    closedMessage: {
      type: String,
      default: 'Expired',
    },
    disableCommenting: {
      type: Boolean,
      default: false,
    },
    disableCommentingMessage: {
      type: String,
      default: '',
    },
    wordlist: {
      banned: {
        type: Array,
        default: [],
      },
      suspect: {
        type: Array,
        default: [],
      },
    },
    charCount: {
      type: Number,
      default: 5000,
    },
    charCountEnable: {
      type: Boolean,
      default: false,
    },
    requireEmailConfirmation: {
      type: Boolean,
      default: false,
    },
    domains: {
      whitelist: {
        type: Array,
        default: ['localhost'],
      },
    },

    // Length of time (in milliseconds) after a comment is posted that it can still be edited by the author
    editCommentWindowLength: {
      type: Number,
      min: [0, 'Edit Comment Window length must be greater than zero'],
      default: 30 * 1000,
    },
    tags: [TagSchema],

    // Additional metadata to let plugins write settings.
    metadata: {
      default: {},
      type: Object,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toObject: {
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;

        return ret;
      },
    },
  }
);

module.exports = Setting;
