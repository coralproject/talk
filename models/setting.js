const mongoose = require('../mongoose');
const Schema = mongoose.Schema;

const SettingSchema = new Schema({
  id: {type: String, default: '1'},
  moderation: {type: String, enum: ['pre', 'post'], default: 'pre'},
  infoBoxEnable: {type: Boolean, default: false},
  infoBoxContent: {type: String, default: ''}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

/**
 * this is run once when the app starts to ensure settings are populated
 * @return {Promise} null initialize the global settings object
 */
SettingSchema.statics.init = function (defaults) {
  return this.update({id: '1'}, {$setOnInsert: defaults}, {upsert: true});
};

/**
 * Gets the entire settings record and sends it back
 * @return {Promise} settings the whole settings record
 */
SettingSchema.statics.getSettings = function () {
  return this.findOne({id: '1'});
};

/**
 * Gets the moderation settings and sends it back
 * @return {Promise} moderation the settings for how to moderate comments
 */
SettingSchema.statics.getModerationSetting = function () {
  return this.findOne({id: '1'}).select('moderation');
};

/**
 * Gets the info box settings and sends it back
 * @return {Promise} content the content of the info Box
 */
SettingSchema.statics.getInfoBoxSetting = function () {
  return this.findOne({id: '1'}).select('infoBoxEnable', 'infoBoxContent');
};

/**
 * This will update the settings object with whatever you pass in
 * @param  {object} setting a hash of whatever settings you want to update
 * @return {Promise} settings Promise that resolves to the entire (updated) settings object.
 */
SettingSchema.statics.updateSettings = function (setting) {
  // There should only ever be one record unless something has gone wrong.
  // In the future we may have multiple records for custom settings for objects/users.
  return this.findOneAndUpdate({id: '1'}, {$set: setting}, {new: true});
};

const Setting = mongoose.model('Setting', SettingSchema);

module.exports = Setting;
