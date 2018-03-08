const CommentModel = require('../models/comment');
const AssetModel = require('../models/asset');
const SettingsService = require('./settings');
const DomainList = require('./domain_list');
const errors = require('../errors');
const merge = require('lodash/merge');
const isEmpty = require('lodash/isEmpty');
const { dotize } = require('./utils');

module.exports = class AssetsService {
  /**
   * Finds an asset by its id.
   * @param {String} id  identifier of the asset (uuid).
   */
  static findById(id) {
    return AssetModel.findOne({ id });
  }

  /**
   * Finds a asset by its url.
   * @param {String} url  identifier of the asset (uuid).
   */
  static findByUrl(url) {
    return AssetModel.findOne({ url });
  }

  /**
   * Retrieves the settings given an asset query and rectifies it against the
   * global settings.
   * @param  {Promise} assetQuery an asset query that returns a single asset.
   * @return {Promise}
   */
  static async rectifySettings(assetQuery, settings = null) {
    const [globalSettings, asset] = await Promise.all([
      settings !== null ? settings : SettingsService.retrieve(),
      assetQuery,
    ]);

    // If the asset exists and has settings then return the merged object.
    if (asset && asset.settings && !isEmpty(asset.settings)) {
      settings = merge({}, globalSettings, asset.settings);
    } else {
      settings = globalSettings;
    }

    return settings;
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
    return Promise.all([
      DomainList.urlCheck(url),
      SettingsService.retrieve(),
    ]).then(([whitelisted, settings]) => {
      const update = { $setOnInsert: { url } };

      if (settings.autoCloseStream) {
        update.$setOnInsert.closedAt = new Date(
          Date.now() + settings.closedTimeout * 1000
        );
      }

      if (!whitelisted) {
        return Promise.reject(errors.ErrInvalidAssetURL);
      } else {
        return AssetModel.findOneAndUpdate({ url }, update, {
          // Ensure that if it's new, we return the new object created.
          new: true,

          // Perform an upsert in the event that this doesn't exist.
          upsert: true,

          // Set the default values if not provided based on the mongoose models.
          setDefaultsOnInsert: true,
        });
      }
    });
  }

  /**
   * Updates the settings for the asset.
   * @param  {String} id        id of asset
   * @param  {Object} settings  new settings values
   * @return {Promise}
   */
  static async overrideSettings(id, settings) {
    try {
      const result = await AssetModel.findOneAndUpdate(
        { id },
        {
          // The effect of dotize is that only the provided setting values are overwritten
          // and does not replace the whole object.
          $set: dotize({ settings }),
        },
        {
          new: true,
        }
      );
      return result;
    } catch (e) {
      // Legacy data models contains `settings=null` as a default which cannot be traversed.
      // New data models uses `settings={}`.
      if (e.code === 16837) {
        // Overwrite it fully in this case.
        const result = await AssetModel.findOneAndUpdate(
          { id },
          {
            $set: { settings },
          },
          {
            new: true,
          }
        );
        return result;
      } else {
        throw e;
      }
    }
  }

  /**
   * Finds assets matching keywords on the model.
   * @param  {String} value string to search by.
   * @return {Promise}
   */
  static search({ value, limit, open, sortOrder, cursor } = {}) {
    let assets = AssetModel.find({});

    if (value && value.length > 0) {
      assets.merge({
        $text: {
          $search: value,
        },
      });
    }

    if (open != null) {
      if (open) {
        assets.merge({
          $or: [
            {
              closedAt: null,
            },
            {
              closedAt: {
                $gt: Date.now(),
              },
            },
          ],
        });
      } else {
        assets.merge({
          closedAt: {
            $lt: Date.now(),
          },
        });
      }
    }

    if (cursor) {
      if (sortOrder === 'DESC') {
        assets.merge({
          created_at: {
            $lt: cursor,
          },
        });
      } else {
        assets.merge({
          created_at: {
            $gt: cursor,
          },
        });
      }
    }

    return assets
      .sort({ created_at: sortOrder === 'DESC' ? -1 : 1 })
      .limit(limit);
  }

  /**
   * Finds multiple assets with matching ids
   * @param  {Array} ids an array of Strings of asset_id
   * @return {Promise}     resolves to list of Assets
   */
  static async findByIDs(ids) {
    // Find the assets.
    let assets = await AssetModel.find({
      id: {
        $in: ids,
      },
    });

    // Return them in the right order.
    return ids.map(id => assets.find(asset => asset.id === id));
  }

  static async updateURL(id, url) {
    // Try to see if an asset already exists with the given url.
    let asset = await AssetsService.findByUrl(url);
    if (asset !== null) {
      throw errors.ErrAssetURLAlreadyExists;
    }

    // Seems that there was no other asset with the same url, try and perform
    // the rename operation! An error may be thrown from this if the operation
    // fails. This is ok.
    await AssetModel.update({ id }, { $set: { url } });
  }

  static async merge(srcAssetID, dstAssetID) {
    // Fetch both assets.
    let [srcAsset, dstAsset] = await AssetsService.findByIDs([
      srcAssetID,
      dstAssetID,
    ]);
    if (!srcAsset || !dstAsset) {
      throw errors.ErrNotFound;
    }

    // Resolve the merge operation, this invloves moving all resources attached
    // to the src asset to the dst asset, and then removing the src asset.

    // First, update all the old comments to the new asset.
    await CommentModel.update(
      {
        asset_id: srcAssetID,
      },
      {
        $set: {
          asset_id: dstAssetID,
        },
      },
      {
        multi: true,
      }
    );

    // Second remove the old asset.
    await AssetModel.remove({
      id: srcAssetID,
    });

    // That's it!
  }

  static all(limit = undefined) {
    return AssetModel.find({}).limit(limit);
  }
};
