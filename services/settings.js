const SettingModel = require('../models/setting');
const errors = require('../errors');

function dotizeRecurse(result, object, path = '') {
  for (const key in object) {
    const newPath = path ? `${path}.${key}` : key;
    if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
      dotizeRecurse(result, object[key], newPath);
      return;
    }
    result[newPath] = object[key];
  }
}

/**
 * Dotize turns a nested object into flattened object with
 * dotized key notation. Arrays do not become dotized.
 *
 * e.g. {a: {b: 'c'}} becomes {'a.b': 'c}
 *
 * @param {Object} object
 * @return {Object} dotized object
 */
function dotize(object) {
  const result = {};
  dotizeRecurse(result, object);
  return result;
}

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
      $set: dotize(settings)
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
