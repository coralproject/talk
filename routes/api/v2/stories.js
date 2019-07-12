const express = require('express');
const Joi = require('joi');
const { get, first, last } = require('lodash');

const authorization = require('../../../middleware/authorization');
const AssetModel = require('../../../models/asset');

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
  cursor: Joi.string()
    .empty('')
    .default(''),
});

function validate(query) {
  const { value, error } = Joi.validate(query, ListStorySchema, {
    presence: 'optional',
  });
  if (error) {
    throw error;
  }

  return value;
}

router.get(
  '/',
  authorization.needed('ADMIN', 'MODERATOR'),
  async (req, res, next) => {
    try {
      // Validate and extract the query arguments.
      let { cursor, value, filter, limit } = validate(req.query);
      const isTextBasedSearch = value.length > 0;

      // The cursor can be a date or a number based on the style of search being
      // performed.
      cursor = Joi.attempt(
        cursor,
        isTextBasedSearch
          ? Joi.number()
              .empty('')
              .min(0)
              .default(0)
          : Joi.date()
              .empty('')
              .default(null)
      );

      // Create a new query to begin adding conditions.
      let query = AssetModel.find(
        {},
        isTextBasedSearch ? { score: { $meta: 'textScore' } } : {}
      );

      if (filter === 'open') {
        // Filter by open stories.
        query.merge({
          $or: [{ closedAt: null }, { closedAt: { $gt: Date.now() } }],
        });
      } else if (filter === 'closed') {
        // Filter by closed stories.
        query.merge({
          closedAt: {
            $lt: Date.now(),
          },
        });
      }

      if (isTextBasedSearch) {
        // This is a text based search, so search by the value.
        query.merge({
          $text: {
            $search: value,
          },
        });

        // Sort by text search score.
        query.sort({ score: { $meta: 'textScore' } });

        if (cursor) {
          // We are paginating, so we should skip stories based on the cursor.
          query.skip(cursor);
        }
      } else {
        // This is not a text based search, so sort by the created timestamp.
        query.sort({ created_at: -1 });

        if (cursor) {
          // We are paginating, so we should sort based on the created
          // timestamp.
          query.merge({
            created_at: {
              $lt: cursor,
            },
          });
        }
      }

      // Execute the query.
      const results = await query.limit(limit + 1);

      const textTransformer = (node, idx) => ({
        node,
        cursor: idx + cursor + 1,
      });

      const dateTransformer = node => ({
        node,
        cursor: node.created_at,
      });

      // Slice the nodes to get only the requested number of elements.
      const edges = results
        .slice(0, limit)
        .map(isTextBasedSearch ? textTransformer : dateTransformer);

      // Generate the pageInfo.
      const pageInfo = {
        startCursor: get(first(edges), 'cursor', null),
        endCursor: get(last(edges), 'cursor', null),
        hasNextPage: results.length > limit,
      };

      // Send back the asset data.
      return res.json({ edges, pageInfo });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
