const Setting = require('../models/setting');
const { ErrSettingsNotInit } = require('../errors');
const { dotize } = require('./utils');
const { isEmpty, zipObject } = require('lodash');
const DataLoader = require('dataloader');

const selector = { id: '1' };

async function loadFn(/* fields = [] */) {
  // Originally, we used the projection operation, turns out this isn't that
  // fast. We should utilize the redis cache instead here.
  // const model = await Setting.findOne(selector).select(uniq(fields));

  const model = await Setting.findOne(selector);
  if (!model) {
    throw new ErrSettingsNotInit();
  }

  return model.toObject();
}

// batchLoadFn will load a settings object with all the requested fields.
async function batchLoadFn(fields) {
  // Load a settings object with all the requested fields.
  const obj = await loadFn(fields);

  // Return the specific fields for each of the fields that were loaded.
  return fields.map(field => obj[field]);
}

// batchedSettingsLoader will load setting fields for each request. This isn't a
// cached loader, so this is really just for optimizing the requests made to the
// database by batching.
const batchedSettingsLoader = new DataLoader(batchLoadFn, { cache: false });

class Settings {
  static async retrieve(...fields) {
    if (!isEmpty(fields)) {
      // Included for backwards compatibility.
      return Settings.select(...fields);
    }

    // Call the loadFn directly if we need to load all the fields.
    return loadFn(fields);
  }

  static async select(...fields) {
    // Load all the values for the specific fields.
    const values = await batchedSettingsLoader.loadMany(fields);

    // Zip up the fields and values to create an object to return and return the
    // assembled Settings object.
    return zipObject(fields, values);
  }

  static async update(settings) {
    const updatedSettings = await Setting.findOneAndUpdate(
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

    return updatedSettings;
  }

  static init(defaults = {}) {
    return Settings.retrieve().catch(() => {
      const settings = new Setting(defaults);

      return settings.save();
    });
  }
}

module.exports = Settings;
