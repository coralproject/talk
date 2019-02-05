const express = require('express');
const Joi = require('joi');
const router = express.Router();
const authorization = require('../../../middleware/authorization');
const { ErrHTTPNotFound } = require('../../../errors');
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

const ListAssetsSchema = Joi.object({
  value: Joi.string()
    .empty('')
    .default(''),
  field: Joi.string()
    .empty('')
    .default('publication_date'),
  page: Joi.number()
    .empty('')
    .default(1)
    .min(1),
  asc: Joi.bool()
    .empty('')
    .default(false),
  filter: Joi.string()
    .empty('')
    .valid(['all', 'open', 'closed'])
    .default('all'),
  limit: Joi.number()
    .empty('')
    .default(20)
    .max(500)
    .min(0),
});

// List assets.
router.get(
  '/',
  authorization.needed('ADMIN', 'MODERATOR'),
  async (req, res, next) => {
    const { value: query, error: err } = Joi.validate(
      req.query,
      ListAssetsSchema,
      {}
    );
    if (err) {
      return next(err);
    }

    let { value, field, page, asc, filter, limit } = query;

    try {
      const order = asc ? 1 : -1;

      const queryOpts = {
        sort: { [field]: order, created_at: order },
        skip: (page - 1) * limit,
        limit: limit,
      };

      // Find all the assets.
      let [result, count] = await Promise.all([
        // Find the actual assets.
        FilterOpenAssets(AssetsService.search({ value }), filter)
          .sort(queryOpts.sort)
          .skip(queryOpts.skip)
          .limit(queryOpts.limit)
          .lean(),

        // Get the count of actual assets.
        FilterOpenAssets(AssetsService.search({ value }), filter).count(),
      ]);

      // Send back the asset data.
      res.json({
        result,
        limit,
        count,
        page,
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
        return next(new ErrHTTPNotFound());
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
