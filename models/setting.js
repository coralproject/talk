const mongoose = require('../mongoose');
const Schema = mongoose.Schema;

const SettingSchema = new Schema({
  id: {type: String, default: '1'},
  moderation: {type: String, enum: ['pre', 'post'], default: 'pre'}
}, {
  _id: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

/**
 * gets the entire settings record and sends it back
 * @return {Promise} settings the whole settings record
 */
SettingSchema.statics.getSettings = function () {
  return this.findOne({id: '1'});
};

/**
 * this will update the settings object with whatever you pass in
 * @param  {object} setting a hash of whatever settings you want to update
 * @return {Promise} settings Promise that resolves to the entire (updated) settings object.
 */
SettingSchema.statics.updateSettings = function (setting) {
  // there should only ever be one record unless something has gone wrong.
  return this.findOneAndUpdate({id: '1'}, {$set: setting}, {new: true});
};

const Setting = mongoose.model('Setting', SettingSchema);

module.exports = Setting;
