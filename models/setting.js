const mongoose = require('../services/mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');

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
      'pre',
      'post'
    ],
    default: 'pre'
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
    default: ''
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
 * toJSON provides settings overrides to this object's serialization methods.
 */
SettingSchema.options.toJSON = {};
SettingSchema.options.toJSON.virtuals = true;

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
 * Filters the object for the given user only allowing those with the allowed
 * roles/permissions to access particular parameters.
 */
SettingSchema.method('filterForUser', function(user = false) {
  if (!user || !user.roles.includes('admin')) {
    return _.pick(this.toJSON(), [
      'moderation',
      'infoBoxEnable',
      'infoBoxContent',
      'closeTimeout',
      'closedMessage',
      'charCountEnable',
      'charCount',
      'requireEmailConfirmation'
    ]);
  }

  return this.toJSON();
});

/**
 * The Mongo Mongoose object.
 */
const Setting = mongoose.model('Setting', SettingSchema);

/**
 * The Setting Service object exposing the Setting model.
 * @type {Object}
 */
const SettingService = module.exports = {};

/**
 * The selector used to uniquely identify the settings document.
 */
const selector = {id: '1'};

/**
 * Gets the entire settings record and sends it back
 * @return {Promise} settings the whole settings record
 */
SettingService.retrieve = () => Setting.findOne(selector);

/**
 * This will update the settings object with whatever you pass in
 * @param  {object} setting a hash of whatever settings you want to update
 * @return {Promise} settings Promise that resolves to the entire (updated) settings object.
 */
SettingService.update = (settings) => Setting.findOneAndUpdate(selector, {
  $set: settings
}, {
  upsert: true,
  new: true,
  setDefaultsOnInsert: true
});

/**
 * This is run once when the app starts to ensure settings are populated.
 * @return {Promise} null initialize the global settings object
 */
SettingService.init = (defaults) => {

  // Inject the defaults on top of the passed in defaults to ensure that the new
  // settings conform to the required selector.
  defaults = Object.assign({}, defaults, selector);

  // Actually update the settings collection.
  return SettingService.update(defaults);
};
