const express = require('express');
const router = express.Router();
const authorization = require('../../../middleware/authorization');

const errors = require('../../../errors');
const AssetsService = require('../../../services/assets');

const AssetModel = require('../../../models/asset');

const FilterOpenAssets = (query, filter) => {
  switch (filter) {
    case 'open':
      return query.merge({
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
    case 'closed':
      return query.merge({
        closedAt: {
          $lt: Date.now(),
        },
      });
    default:
      return query;
  }
};

// List assets.
router.get(
  '/',
  authorization.needed('ADMIN', 'MODERATOR'),
  async (req, res, next) => {
    const {
      value = '',
      field = 'publication_date',
      page = 1,
      asc = 'false',
      filter = 'all',
      limit = 20,
    } = req.query;

    try {
      const order = asc === 'true' ? 1 : -1;

      const queryOpts = {
        sort: { [field]: order, created_at: order },
        skip: (page - 1) * limit,
        limit,
      };

      // Find all the assets.
      let [result, count] = await Promise.all([
        // Find the actuall assets.
        FilterOpenAssets(AssetsService.search({ value }), filter)
          .sort(queryOpts.sort)
          .skip(parseInt(queryOpts.skip))
          .limit(parseInt(queryOpts.limit))
          .lean(),

        // Get the count of actual assets.
        FilterOpenAssets(AssetsService.search({ value }), filter).count(),
      ]);

      // Send back the asset data.
      res.json({
        result,
        limit: Number(limit),
        count,
        page: Number(page),
        totalPages: Math.ceil(count / (limit === 0 ? 1 : limit)),
      });
    } catch (e) {
      return next(e);
    }
  }
);

// Get an asset by id.
router.get(
  '/:asset_id',
  authorization.needed('ADMIN', 'MODERATOR'),
  async (req, res, next) => {
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
  }
);

router.put(
  '/:asset_id/settings',
  authorization.needed('ADMIN'),
  async (req, res, next) => {
    try {
      await AssetsService.overrideSettings(req.params.asset_id, req.body);
      res.status(204).end();
    } catch (e) {
      return next(e);
    }
  }
);

router.put(
  '/:asset_id/status',
  authorization.needed('ADMIN'),
  async (req, res, next) => {
    const { closedAt, closedMessage } = req.body;

    try {
      await AssetModel.update(
        {
          id: req.params.asset_id,
        },
        {
          $set: {
            closedAt,
            closedMessage,
          },
        }
      );

      res.status(204).json();
    } catch (e) {
      return next(e);
    }
  }
);

module.exports = router;
