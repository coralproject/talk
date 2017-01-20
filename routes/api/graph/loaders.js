const DataLoader = require('dataloader');
const _ = require('lodash');
const url = require('url');
const errors = require('../../../errors');
const scraper = require('../../../services/scraper');

const Comment = require('../../../models/comment');
const User = require('../../../models/user');
const Action = require('../../../models/action');
const Asset = require('../../../models/asset');
const Settings = require('../../../models/setting');

/**
 * SingletonResolver is a cached loader for a single result.
 */
class SingletonResolver {
  constructor(resolver) {
    this._cache = null;
    this._resolver = resolver;
  }

  load() {
    if (this._cache) {
      return this._cache;
    }

    let promise = this._resolver(arguments).then((result) => {
      return result;
    });

    // Set the promise on the cache.
    this._cache = promise;

    return promise;
  }
}

/**
 * This joins a set of results with a specific keys and sets an empty array in
 * place if it was not found.
 * @param  {Array}  ids ids to locate
 * @param  {String} key key to group by
 * @return {Array}      array of results
 */
const arrayJoinBy = (ids, key) => (items) => {
  const itemsByKey = _.groupBy(items, key);
  return ids.map((id) => {
    if (id in itemsByKey) {
      return itemsByKey[id];
    }

    return [];
  });
};

/**
 * This joins a set of results with a specific keys and sets null in place if it
 * was not found.
 * @param  {Array}  ids ids to locate
 * @param  {String} key key to group by
 * @return {Array}      array of results
 */
const singleJoinBy = (ids, key) => (items) => {
  const itemsByKey = _.groupBy(items, key);
  return ids.map((id) => {
    if (id in itemsByKey) {
      return itemsByKey[id][0];
    }

    return null;
  });
};

/**
 * Retrieves assets by an array of ids.
 * @param {Array} ids array of ids to lookup
 */
const genAssetsByID = (ids) => Asset.find({
  id: {
    $in: ids
  }
}).then(singleJoinBy(ids, 'id'));

/**
 * Retrieves actions by an array of ids.
 * @param {Array} ids array of ids to lookup
 */
const genActionsByID = (ids, user = {}) => Action.getActionSummaries(ids, user.id).then(arrayJoinBy(ids, 'item_id'));

/**
 * Retrieves comments by an array of asset id's.
 * @param {Array} ids array of ids to lookup
 */
const genCommentsByAssetID = (ids) => Comment.find({
  asset_id: {
    $in: ids
  },
  parent_id: null,
  status: {
    $in: [null, 'accepted']
  }
}).then(arrayJoinBy(ids, 'asset_id'));

/**
 * Retrieves comments by an array of parent ids.
 * @param {Array} ids array of ids to lookup
 */
const genCommentsByParentID = (ids) => Comment.find({
  parent_id: {
    $in: ids
  },
  status: {
    $in: [null, 'accepted']
  }
}).then(arrayJoinBy(ids, 'parent_id'));

/**
 * This endpoint find or creates an asset at the given url when it is loaded.
 * @param   {String} asset_url the url passed in from the query
 * @returns {Promise}          resolves to the asset
 */
const findOrCreateAssetByURL = (asset_url) => {

  // Verify that the asset_url is parsable.
  let parsed_asset_url = url.parse(asset_url);
  if (!parsed_asset_url.protocol) {
    return Promise.reject(errors.ErrInvalidAssetURL);
  }

  return Asset.findOrCreateByUrl(asset_url)
    .then((asset) => {

      // If the asset wasn't scraped before, scrape it! Otherwise just return
      // the asset.
      if (!asset.scraped) {
        return scraper.create(asset).then(() => asset);
      }

      return asset;
    });
};

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
const createLoaders = (context) => ({
  Comments: {
    getByParentID: new DataLoader((ids) => genCommentsByParentID(ids)),
    getByAssetID: new DataLoader((ids) => genCommentsByAssetID(ids)),
  },
  Actions: {
    getByID: new DataLoader((ids) => genActionsByID(ids, context.user)),
  },
  Users: {
    getByID: new DataLoader((ids) => User.findByIdArray(ids))
  },
  Assets: {

    // TODO: decide whether we want to move these to mutators or not, as in fact
    // this operation create a new asset if one isn't found.
    getByURL: (url) => findOrCreateAssetByURL(url),

    getByID: new DataLoader((ids) => genAssetsByID(ids)),
    getAll: new SingletonResolver(() => Asset.find({}))
  },
  Settings: new SingletonResolver(() => Settings.retrieve())
});

module.exports = createLoaders;
