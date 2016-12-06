const mongoose = require('../mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');
const cache = require('../cache');

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
  wordlist: [String]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
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
 * Cache expiry time in seconds for when the cached entry of the settings object
 * expires. 2 minutes.
 */
const EXPIRY_TIME = 60 * 2;

/**
 * Gets the entire settings record and sends it back
 * @return {Promise} settings the whole settings record
 */
SettingService.retrieve = () => cache.wrap('settings', EXPIRY_TIME, () => Setting.findOne(selector));

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
}).then((settings) => {

  // Invalidate the settings cache.
  return cache
    .set('settings', settings, EXPIRY_TIME)
    .then(() => settings);
});

/**
 * Filters the document to ensure that the resulting document is indeed ready
 * for non authenticated users.
 * @param  {Object} settings the source settings object
 * @return {Object}          the filtered settings object
 */
SettingService.public = (settings) => _.pick(settings, ['moderation', 'infoBoxEnable', 'infoBoxContent']);

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
