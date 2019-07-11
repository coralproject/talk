const express = require('express');
const Joi = require('joi');
const { get, first, last } = require('lodash');

const authorization = require('../../../middleware/authorization');
const AssetsService = require('../../../services/assets');

const router = express.Router();

const ListStorySchema = Joi.object({
  value: Joi.string()
    .empty('')
    .default(''),
  filter: Joi.string()
    .empty('')
    .valid(['all', 'open', 'closed'])
    .default('all'),
  limit: Joi.number()
    .empty('')
    .default(20)
    .max(500)
    .min(0),
  cursor: Joi.date()
    .empty('')
    .default(''),
});

function convertFilterToOpen(filter) {
  switch (filter) {
    case 'open':
      return true;
    case 'closed':
      return false;
    default:
      return null;
  }
}

router.get(
  '/',
  authorization.needed('ADMIN', 'MODERATOR'),
  async (req, res, next) => {
    const { value: query, error: err } = Joi.validate(
      req.query,
      ListStorySchema,
      { presence: 'optional' }
    );
    if (err) {
      return next(err);
    }

    let { value, filter, limit, cursor } = query;

    try {
      // Search for the specified stories.
      const results = await AssetsService.search({
        // Search by a term.
        value,
        // Filter by open stories.
        open: convertFilterToOpen(filter),
        // Limit the results.
        limit: limit + 1,
        // Optionally include a cursor for paginating.
        cursor,
        // Specifies the sort order.
        sortOrder: 'DESC',
      });

      // Slice the nodes to get only the requested number of elements.
      const edges = results.slice(0, limit).map(node => ({
        node,
        cursor: node.created_at,
      }));

      // Generate the pageInfo.
      const pageInfo = {
        startCursor: get(first(edges), 'cursor', null),
        endCursor: get(last(edges), 'cursor', null),
        hasNextPage: results.length > limit,
      };

      // Send back the asset data.
      return res.json({ edges, pageInfo });
    } catch (e) {
      return next(e);
    }
  }
);

module.exports = router;
