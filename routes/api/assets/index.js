const express = require('express');
const router = express.Router();

const scraper = require('../../../services/scraper');
const errors = require('../../../errors');
const AssetsService = require('../../../services/assets');

const AssetModel = require('../../../models/asset');

const FilterOpenAssets = (query, filter) => {
  switch(filter) {
  case 'open':
    return query.merge({
      $or: [
        {
          closedAt: null
        },
        {
          closedAt: {
            $gt: Date.now()
          }
        }
      ]
    });
  case 'closed':
    return query.merge({
      closedAt: {
        $lt: Date.now()
      }
    });
  default:
    return query;
  }
};

// List assets.
router.get('/', async (req, res, next) => {

  const {
    limit = 20,
    skip = 0,
    sort = 'asc',
    field = 'created_at',
    filter = 'all',
    search = ''
  } = req.query;

  try {

    // Find all the assets.
    let [result, count] = await Promise.all([

      // Find the actuall assets.
      FilterOpenAssets(AssetsService.search({value: search}), filter)
        .sort({[field]: (sort === 'asc') ? 1 : -1})
        .skip(parseInt(skip))
        .limit(parseInt(limit)),

      // Get the count of actual assets.
      FilterOpenAssets(AssetsService.search({value: search}), filter)
        .count()
    ]);

    // Send back the asset data.
    res.json({
      result,
      count
    });
  } catch (e) {
    return next(e);
  }

});

// Get an asset by id.
router.get('/:asset_id', async (req, res, next) => {
  try {

    // Send back the asset.
    let asset = await AssetsService.findById(req.params.asset_id);
    if (!asset) {
      return next(errors.ErrNotFound);
    }

    return res.json(asset);
  } catch (e) {
    return next(e);
  }
});

// Adds the asset id to the queue to be scraped.
router.post('/:asset_id/scrape', async (req, res, next) => {
  try {

    // Send back the asset.
    let asset = await AssetsService.findById(req.params.asset_id);
    if (!asset) {
      return next(errors.ErrNotFound);
    }

    let job = await scraper.create(asset);

    // Send the job back for monitoring.
    res.status(201).json(job);
  } catch (e) {
    return next(e);
  }
});

router.put('/:asset_id/settings', async (req, res, next) => {
  try {
    await AssetsService.overrideSettings(req.params.asset_id, req.body);
    res.status(204).end();
  } catch (e) {
    return next(e);
  }
});

router.put('/:asset_id/status', async (req, res, next) => {
  const {
    closedAt,
    closedMessage
  } = req.body;

  try {
    await AssetModel.update({
      id: req.params.asset_id
    }, {
      $set: {
        closedAt,
        closedMessage
      }
    });

    res.status(204).json();
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
