const SettingModel = require('../models/setting');

/**
 * The selector used to uniquely identify the settings document.
 */
const selector = {id: '1'};

/**
 * The Setting Service object exposing the Setting model.
 */
module.exports = class SettingsService {

  /**
   * Gets the entire settings record and sends it back
   * @return {Promise} settings the whole settings record
   */
  static retrieve() {
    return SettingModel.findOne(selector);
  }

  /**
   * This will update the settings object with whatever you pass in
   * @param  {object} setting a hash of whatever settings you want to update
   * @return {Promise} settings Promise that resolves to the entire (updated) settings object.
   */
  static update(settings) {
    return SettingModel.findOneAndUpdate(selector, {
      $set: settings
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    });
  }

  /**
   * This is run once when the app starts to ensure settings are populated.
   * @return {Promise} null initialize the global settings object
   */
  static init(defaults) {

    // Inject the defaults on top of the passed in defaults to ensure that the new
    // settings conform to the required selector.
    defaults = Object.assign({}, defaults, selector);

    // Actually update the settings collection.
    return SettingsService.update(defaults);
  }
};
