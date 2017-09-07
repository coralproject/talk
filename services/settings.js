const SettingModel = require('../models/setting');
const errors = require('../errors');

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
    return SettingModel
      .findOne(selector)
      .then((settings) => {
        if (!settings) {
          return Promise.reject(errors.ErrSettingsNotInit);
        }

        return settings;
      });
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
   * updateWordlist will update the wordlists.
   *
   * @param {Object} wordlist the Wordlist object
   */
  static updateWordlist(wordlist) {
    return SettingModel.findOneAndUpdate(selector, {
      $set: {
        wordlist,
      },
    });
  }

  /**
   * This is run once when the app starts to ensure settings are populated.
   */
  static init(defaults = {}) {
    return SettingsService
      .retrieve()
      .catch(() => {
        let settings = new SettingModel(defaults);

        return settings.save();
      });
  }
};
