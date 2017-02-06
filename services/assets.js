const AssetModel = require('../models/asset');
const SettingsService = require('./settings');
const domainlist = require('./domainlist');
const errors = require('../errors');

module.exports = class AssetsService {

  /**
   * Finds an asset by its id.
   * @param {String} id  identifier of the asset (uuid).
   */
  static findById(id) {
    return AssetModel.findOne({id});
  }

  /**
   * Finds a asset by its url.
   * @param {String} url  identifier of the asset (uuid).
   */
  static findByUrl(url) {
    return AssetModel.findOne({url});
  }

  /**
   * Retrieves the settings given an asset query and rectifies it against the
   * global settings.
   * @param  {Promise} assetQuery an asset query that returns a single asset.
   * @return {Promise}
   */
  static rectifySettings(assetQuery) {
    return Promise.all([
      SettingsService.retrieve(),
      assetQuery
    ]).then(([settings, asset]) => {

      // If the asset exists and has settings then return the merged object.
      if (asset && asset.settings) {
        settings.merge(asset.settings);
      }

      return settings;
    });
  }

  /**
   * Finds a asset by its url.
   *
   * NOTE: This function has scalability concerns regarding mongoose's decision
   * always write {updated_at: new Date()} on every call to findOneAndUpdate
   * even though the update document exactly matches the query document... In
   * the future this function should never update, only findOneAndCreate but this
   * is not possible with the mongoose driver.
   *
   * @param {String} url  identifier of the asset (uuid).
   * @return {Promise}
   */
  static findOrCreateByUrl(url) {

    // Check the URL to confirm that is in the domain whitelist
    if (!domainlist.urlCheck(url)) {
      return Promise.reject(errors.ErrInvalidAssetURL);
    }

    return AssetModel.findOneAndUpdate({url}, {url}, {

      // Ensure that if it's new, we return the new object created.
      new: true,

      // Perform an upsert in the event that this doesn't exist.
      upsert: true,

      // Set the default values if not provided based on the mongoose models.
      setDefaultsOnInsert: true
    });
  }

  /**
   * Updates the settings for the asset.
   * @param  {[type]} id       [description]
   * @param  {[type]} settings [description]
   * @return {[type]}          [description]
   */
  static overrideSettings(id, settings) {
    return AssetModel.findOneAndUpdate({id}, {
      $set: {
        settings
      }
    }, {
      new: true
    });
  }

  /**
   * Finds assets matching keywords on the model. If `value` is an empty string,
   * then it will not even perform a text search query.
   * @param  {String} value string to search by.
   * @return {Promise}
   */
  static search(value = '', skip = null, limit = null) {
    if (value.length === 0) {
      return AssetsService.all(skip, limit);
    } else {
      return AssetModel
        .find({
          $text: {
            $search: value
          }
        })
        .skip(skip)
        .limit(limit);
    }
  }

  /**
   * Finds multiple assets with matching ids
   * @param  {Array} ids an array of Strings of asset_id
   * @return {Promise}     resolves to list of Assets
   */
  static findMultipleById(ids) {
    const query = ids.map(id => ({id}));
    return AssetModel.find(query);
  }

  static all(skip = null, limit = null) {
    return AssetModel
      .find({})
      .skip(skip)
      .limit(limit);
  }
};
