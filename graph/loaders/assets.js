const DataLoader = require('dataloader');
const url = require('url');

const errors = require('../../errors');
const scraper = require('../../services/scraper');
const util = require('./util');

const AssetModel = require('../../models/asset');
const AssetsService = require('../../services/assets');

/**
 * Retrieves assets by an array of ids.
 * @param {Object} context the context of the request
 * @param {Array}  ids     array of ids to lookup
 */
const genAssetsByID = (context, ids) => AssetModel.find({
  id: {
    $in: ids
  }
}).then(util.singleJoinBy(ids, 'id'));

/**
 * [getAssetsByQuery description]
 * @param  {Object} context  the context of the request
 * @param  {Object} query    the query
 * @return {Promise}         resolves the assets
 */
const getAssetsByQuery = (context, query) => {
  return AssetsService.search(query);
};

/**
 * This endpoint find or creates an asset at the given url when it is loaded.
 * @param   {Object} context   the context of the request
 * @param   {String} asset_url the url passed in from the query
 * @returns {Promise}          resolves to the asset
 */
const findOrCreateAssetByURL = async (context, asset_url) => {

  // Verify that the asset_url is parsable.
  let parsed_asset_url = url.parse(asset_url);
  if (!parsed_asset_url.protocol) {
    throw errors.ErrInvalidAssetURL;
  }

  let asset = await AssetsService.findOrCreateByUrl(asset_url);

  // If the asset wasn't scraped before, scrape it! Otherwise just return
  // the asset.
  if (!asset.scraped) {
    await scraper.create(asset);
  }

  return asset;
};

const getAssetsForMetrics = async ({loaders: {Actions, Comments}}) => {
  let actions = await Actions.getByTypes({action_type: 'FLAG', item_type: 'COMMENT'});

  const ids = actions.map(({item_id}) => item_id);

  return Comments.getByQuery({ids})
    .then((connection) => connection.nodes);
};

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = (context) => ({
  Assets: {

    // TODO: decide whether we want to move these to mutators or not, as in fact
    // this operation create a new asset if one isn't found.
    getByURL: (url) => findOrCreateAssetByURL(context, url),

    search: (query) => getAssetsByQuery(context, query),
    getByID: new DataLoader((ids) => genAssetsByID(context, ids)),
    getForMetrics: () => getAssetsForMetrics(context),
    getAll: new util.SingletonResolver(() => AssetModel.find({}))
  }
});
