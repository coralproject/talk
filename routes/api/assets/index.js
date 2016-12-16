const express = require('express');
const router = express.Router();

const Asset = require('../../../models/asset');
const scraper = require('../../../services/scraper');

// List assets.
router.get('/', (req, res, next) => {

  const {
    limit = 20,
    skip = 0,
    sort = 'asc',
    field = 'created_at',
    filter = 'all',
    search = ''
  } = req.query;

  const assets = (filter, search) => {
    switch(filter) {
    case 'open':
      return Asset.search(search)
        .find({
          $or: [
              {closedAt: null},
              {closedAt: {$gt: Date.now()}}
          ]
        });
    case 'closed':
      return Asset.search(search)
        .find({
          closedAt: {$lt: Date.now()}
        });
    default:
      return Asset.search(search);
    }
  };

  // Find all the assets.
  Promise.all([
    assets(filter, search)
      .sort({[field]: (sort === 'asc') ? 1 : -1})
      .skip(parseInt(skip))
      .limit(parseInt(limit)),
    assets(filter, search)
      .count()
  ])
  .then(([result, count]) => {
    // Send back the asset data.
    res.json({
      result,
      count
    });
  })
  .catch((err) => {
    next(err);
  });

});

// Get an asset by id.
router.get('/:asset_id', (req, res, next) => {

  // Send back the asset.
  Asset
    .findById(req.params.asset_id)
    .then((asset) => {
      if (!asset) {
        return res.status(404).end();
      }

      res.json(asset);
    })
    .catch((err) => {
      next(err);
    });
});

// Adds the asset id to the queue to be scraped.
router.post('/:asset_id/scrape', (req, res, next) => {

  // Create a new asset scrape job.
  Asset
    .findById(req.params.asset_id)
    .then((asset) => {
      if (!asset) {
        return res.status(404).end();
      }

      return scraper.create(asset);
    })
    .then((job) => {

      // Send the job back for monitoring.
      res.status(201).json(job);
    })
    .catch((err) => {
      next(err);
    });
});

router.put('/:asset_id/settings', (req, res, next) => {
  // Override the settings for the asset.
  Asset
    .overrideSettings(req.params.asset_id, req.body)
    .then(() => res.status(204).end())
    .catch((err) => next(err));
});

router.put('/:asset_id/status', (req, res, next) => {

  const id = req.params.asset_id;

  const {
    closedAt,
    closedMessage
  } = req.body;

  Asset
    .update({id}, {
      $set: {
        closedAt,
        closedMessage
      }
    })
    .then(() => {

      res.status(204).json();
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
