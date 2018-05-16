const Settings = require('../../services/settings');
const DataLoader = require('dataloader');
const { zipObject } = require('lodash');

/**
 * SettingsLoader manages loading specific fields only of the Settings object.
 */
class SettingsLoader {
  constructor() {
    this._loader = new DataLoader(this._batchLoadFn.bind(this));
    this._cache = null;
  }

  async _batchLoadFn(fields) {
    // Load a settings object with all the requested fields, unless we have the
    // entire object cached, in which case we'll return the whole cache.
    const obj = this._cache
      ? await this._cache
      : await Settings.select(...fields);

    // Return the specific fields for each of the fields that were loaded.
    return fields.map(field => obj[field]);
  }

  /**
   * load will return the entire Settings object with all fields.
   */
  load() {
    if (this._cache) {
      // Return the cached settings promise.
      return this._cache;
    }

    // Create a promise that will return the settings object.
    const promise = Settings.retrieve();

    // Set this as the cached value.
    this._cache = promise;

    // Return the promised settings.
    return promise;
  }

  /**
   * select will return a promise which resolves to the Settings object that
   * contains the requested fields only.
   *
   * @param {Array<String>} fields the fields from Settings we want to load.
   */
  async select(...fields) {
    // Load all the values for the specific fields.
    const values = await this._loader.loadMany(fields);

    // Zip up the fields and values to create an object to return and return the
    // assembled Settings object.
    return zipObject(fields, values);
  }

  /**
   * get, like select, will retrieve the settings, but get will only return a
   * single setting.
   *
   * @param {String} field the field to get
   */
  async get(field) {
    const value = await this._loader.load(field);

    return value;
  }
}

module.exports = () => ({ Settings: new SettingsLoader() });
