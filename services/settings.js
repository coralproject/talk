const SettingModel = require('../models/setting');
const cache = require('./cache');
const errors = require('../errors');
const { dotize } = require('./utils');
const { SETTINGS_CACHE_TIME } = require('../config');

/**
 * The selector used to uniquely identify the settings document.
 */
const selector = { id: '1' };

const retrieve = async fields => {
  let settings;
  if (fields) {
    settings = await SettingModel.findOne(selector).select(fields);
  } else {
    settings = await SettingModel.findOne(selector);
  }
  if (!settings) {
    throw errors.ErrSettingsNotInit;
  }

  return settings;
};

/**
 * The Setting Service object exposing the Setting model.
 */
module.exports = class SettingsService {
  /**
   * Gets the entire settings record and sends it back
   * @return {Promise} settings the whole settings record
   */
  static async retrieve(fields) {
    if (process.env.NODE_ENV === 'production') {
      // When in production, wrap the settings retrieval with a cache.
      const settings = await cache.h.wrap(
        'settings',
        fields,
        SETTINGS_CACHE_TIME / 1000,
        () => retrieve(fields)
      );

      return new SettingModel(settings);
    }

    return retrieve(fields);
  }

  /**
   * This will update the settings object with whatever you pass in
   * @param  {object} setting a hash of whatever settings you want to update
   * @return {Promise} settings Promise that resolves to the entire (updated) settings object.
   */
  static async update(settings) {
    const updatedSettings = await SettingModel.findOneAndUpdate(
      selector,
      {
        $set: dotize(settings),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    if (process.env.NODE_ENV === 'production') {
      await cache.h.invalidate('settings');
    }

    return updatedSettings;
  }

  /**
   * This is run once when the app starts to ensure settings are populated.
   */
  static init(defaults = {}) {
    return SettingsService.retrieve().catch(() => {
      let settings = new SettingModel(defaults);

      return settings.save();
    });
  }
};
