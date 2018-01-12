const DataLoader = require('dataloader');
const { URL } = require('url');
const { singleJoinBy, SingletonResolver } = require('./util');

const genAssetsByID = ({ connectors: { models: { Asset } } }, ids) =>
  Asset.find({
    id: {
      $in: ids,
    },
  }).then(singleJoinBy(ids, 'id'));

const getAssetsByQuery = async (
  { connectors: { services: { Assets } } },
  query
) => {
  // If we are requesting based on a limit, ask for one more than we want.
  const limit = query.limit;
  if (limit) {
    query.limit += 1;
  }

  const nodes = await Assets.search(query);

  // The hasNextPage is always handled the same (ask for one more than we need,
  // if there is one more, than there is more).
  let hasNextPage = false;
  if (limit && nodes.length > limit) {
    // There was one more than we expected! Set hasNextPage = true and remove
    // the last item from the array that we requested.
    hasNextPage = true;
    nodes.splice(limit, 1);
  }

  return {
    startCursor: nodes && nodes.length > 0 ? nodes[0].created_at : null,
    endCursor:
      nodes && nodes.length > 0 ? nodes[nodes.length - 1].created_at : null,
    hasNextPage,
    nodes,
  };
};

const findOrCreateAssetByURL = async (ctx, url) => {
  // Pull our connectors out of the context.
  const {
    loaders: { Assets, Settings },
    connectors: {
      models: { Asset },
      services: { DomainList, Scraper },
      errors: { ErrInvalidAssetURL },
    },
  } = ctx;

  // Try to validate that the url is valid. If the URL constructor throws an
  // error, throw our internal ErrInvalidAssetURL instead. This will validate
  // that the url contains a valid scheme.
  try {
    new URL(url);
  } catch (err) {
    throw ErrInvalidAssetURL;
  }

  // Try the easy lookup first.
  let asset = await Assets.findByUrl(url);
  if (asset) {
    return asset;
  }

  // Seems the asset wasn't here yet.. We should do some validation.

  // Check for whitelisting + get the settings at the same time.
  const [whitelisted, settings] = await Promise.all([
    DomainList.urlCheck(url),
    Settings.load('autoCloseStream closedTimeout'),
  ]);

  // If the domain wasn't whitelisted, then we shouldn't create this asset!
  if (!whitelisted) {
    throw ErrInvalidAssetURL;
  }

  // Construct the update operator that we'll use to create the asset.
  const update = {
    $setOnInsert: {
      url,
    },
  };

  // If the auto-close stream is enabled, close the stream after the designated
  // timeout.
  if (settings.autoCloseStream) {
    update.$setOnInsert.closedAt = new Date(
      Date.now() + settings.closedTimeout * 1000
    );
  }

  // We're using the findOneAndUpdate here instead of a insert to protect
  // against race conditions.
  asset = await Asset.findOneAndUpdate(
    {
      url,
    },
    update,
    {
      // Ensure that if it's new, we return the new object created.
      new: true,

      // Perform an upsert in the event that this doesn't exist.
      upsert: true,

      // Set the default values if not provided based on the mongoose models.
      setDefaultsOnInsert: true,

      // Ensure that we validate the input that we do have.
      runValidators: true,
    }
  );

  // If this is a new asset, then we need to scrape it!
  if (!asset.scraped) {
    // Create the Scraper job.
    await Scraper.create(asset);
  }

  return asset;
};

const findByUrl = async (
  { connectors: { errors, services: { Assets } } },
  asset_url
) => {
  // Try to validate that the url is valid. If the URL constructor throws an
  // error, throw our internal ErrInvalidAssetURL instead. This will validate
  // that the url contains a valid scheme.
  try {
    new URL(asset_url);
  } catch (err) {
    throw errors.ErrInvalidAssetURL;
  }

  return Assets.findByUrl(asset_url);
};

module.exports = ctx => ({
  Assets: {
    getByURL: url => findOrCreateAssetByURL(ctx, url),
    findByUrl: url => findByUrl(ctx, url),
    getByQuery: query => getAssetsByQuery(ctx, query),
    getByID: new DataLoader(ids => genAssetsByID(ctx, ids)),
    getAll: new SingletonResolver(() => ctx.connectors.models.Asset.find({})),
  },
});
