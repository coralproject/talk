const { ErrNotAuthorized } = require('../../errors');
const {
  UPDATE_ASSET_SETTINGS,
  UPDATE_ASSET_STATUS,
} = require('../../perms/constants');

const AssetsService = require('../../services/assets');
const AssetModel = require('../../models/asset');

/**
 * updateSettings will update the settings on an asset.
 *
 * @param {Object} ctx graphql context
 * @param {String} id the asset's id to update
 * @param {Object} settings the settings to update on the asset.
 */
const updateSettings = async (ctx, id, settings) =>
  AssetsService.overrideSettings(id, settings);

/**
 * updateStatus will update the status of an asset.
 *
 * @param {Object} ctx graphql context
 * @param {String} id the asset's id to update
 * @param {Object} status the status to change on the asset relating to it's
 *                        current state.
 */
const updateStatus = async (ctx, id, { closedAt, closedMessage }) =>
  AssetModel.update(
    {
      id,
    },
    {
      $set: {
        closedAt,
        closedMessage,
      },
    }
  );

/**
 * closeNow will close an asset for commenting.
 *
 * @param {Object} ctx graphql context
 * @param {String} id the asset's id to close
 */
const closeNow = async (ctx, id) =>
  AssetModel.update(
    {
      id,
    },
    {
      $set: {
        closedAt: new Date(),
      },
    }
  );

/**
 * scrapeAsset will force scrape an asset.
 *
 * @param {Object} ctx graphql context
 * @param {String} id the asset's id to scrape
 */
const scrapeAsset = async (ctx, id) => {
  const {
    connectors: {
      services: { Scraper },
    },
  } = ctx;

  return Scraper.create(ctx, id);
};

module.exports = ctx => {
  let mutators = {
    Asset: {
      updateSettings: () => Promise.reject(new ErrNotAuthorized()),
      updateStatus: () => Promise.reject(new ErrNotAuthorized()),
      closeNow: () => Promise.reject(new ErrNotAuthorized()),
      scrape: () => Promise.reject(new ErrNotAuthorized()),
    },
  };

  if (ctx.user) {
    if (ctx.user.can(UPDATE_ASSET_SETTINGS)) {
      mutators.Asset.updateSettings = (id, settings) =>
        updateSettings(ctx, id, settings);
    }

    if (ctx.user.can(UPDATE_ASSET_STATUS)) {
      mutators.Asset.updateStatus = (id, status) =>
        updateStatus(ctx, id, status);
      mutators.Asset.closeNow = id => closeNow(ctx, id);
      mutators.Asset.scrape = id => scrapeAsset(ctx, id);
    }
  }

  return mutators;
};
