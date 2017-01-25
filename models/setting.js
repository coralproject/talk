const mongoose = require('../services/mongoose');
const Schema = mongoose.Schema;

const WordlistSchema = new Schema({
  banned: [String],
  suspect: [String]
}, {
  _id: false
});

/**
 * SettingSchema manages application settings that get used on front and backend.
 * @type {Schema}
 */
const SettingSchema = new Schema({
  id: {
    type: String,
    default: '1'
  },
  moderation: {
    type: String,
    enum: [
      'PRE',
      'POST'
    ],
    default: 'PRE'
  },
  infoBoxEnable: {
    type: Boolean,
    default: false
  },
  infoBoxContent: {
    type: String,
    default: ''
  },
  closedTimeout: {
    type: Number,

    // Two weeks default expiry.
    default: 60 * 60 * 24 * 7 * 2
  },
  closedMessage: {
    type: String,
    default: 'Expired'
  },
  wordlist: WordlistSchema,
  charCount: {
    type: Number,
    default: 5000
  },
  charCountEnable: {
    type: Boolean,
    default: false
  },
  requireEmailConfirmation: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

/**
 * Merges two settings objects.
 */
SettingSchema.method('merge', function(src) {
  SettingSchema.eachPath((path) => {

    // Exclude internal fields...
    if (['id', '_id', '__v', 'created_at', 'updated_at'].includes(path)) {
      return;
    }

    // If the source object contains the path, shallow copy it.
    if (path in src) {
      this[path] = src[path];
    }
  });
});

/**
 * The Mongo Mongoose object.
 */
const Setting = mongoose.model('Setting', SettingSchema);

module.exports = Setting;
