const mongoose = require('../mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

const SettingSchema = new Schema({
  moderation: {type: String, enum: ['pre', 'post'], default: 'pre'},

}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

SettingSchema.statics.getSettings = function () {
  return this.findOne();
};

SettingSchema.statics.updateSettings = function (setting) {
  return this.findOneAndUpdate({}, {$set: setting}, {new: true});
};

const Setting = mongoose.model('Setting', SettingSchema);

module.exports = Setting;
