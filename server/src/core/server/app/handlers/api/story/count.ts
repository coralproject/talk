import Joi from "joi";

import { COUNTS_V2_CACHE_DURATION } from "coral-common/common/lib/constants";
import { CountJSONPData } from "coral-common/common/lib/types/count";
import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { MongoContext } from "coral-server/data/context";
import logger from "coral-server/logger";
import { retrieveManyStoryRatings } from "coral-server/models/comment";
import { PUBLISHED_STATUSES } from "coral-server/models/comment/constants";
import { retrieveStoryCommentCounts, Story } from "coral-server/models/story";
import { hasFeatureFlag, Tenant } from "coral-server/models/tenant";
import { I18n, translate } from "coral-server/services/i18n";
import { find } from "coral-server/services/stories";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

import {
  GQLFEATURE_FLAG,
  GQLSTORY_MODE,
} from "coral-server/graph/schema/__generated__/types";

const NUMBER_CLASS_NAME = "coral-count-number";
const TEXT_CLASS_NAME = "coral-count-text";

interface CountsV2Body {
  storyIDs: string[];
}

const CountsV2BodySchema = Joi.object().keys({
  storyIDs: Joi.array().items(Joi.string().required()).required().max(100),
});

export type JSONPCountOptions = Pick<
  AppOptions,
  "mongo" | "tenantCache" | "i18n"
>;

const StoryCountJSONPQuerySchema = Joi.object()
  .keys({
    // Required for JSONP support.
    callback: Joi.string().allow("").optional(),
    id: Joi.string().optional(),
    url: Joi.string().optional(),
    ref: Joi.string().required(),
  })
  .or("id", "url");

interface StoryCountJSONPQuery {
  callback: string;
  id?: string;
  url?: string;
  ref: string;
}

export function getTextHTML(
  tenant: Readonly<Tenant>,
  storyMode: GQLSTORY_MODE | undefined | null,
  i18n: I18n,
  count: number
) {
  // Use translated string.
  const bundle = i18n.getBundle(tenant.locale);

  let html = "";

  if (storyMode === GQLSTORY_MODE.RATINGS_AND_REVIEWS) {
    html = translate(
      bundle,
      `<span class="${TEXT_CLASS_NAME}">Ratings</span>`,
      "comment-counts-ratings-and-reviews",
      {
        number: count,
        textClass: TEXT_CLASS_NAME,
      }
    );
  } else {
    html = translate(
      bundle,
      `<span class="${TEXT_CLASS_NAME}">Comments</span>`,
      "comment-count",
      {
        number: count,
        textClass: TEXT_CLASS_NAME,
      }
    );
  }

  return html;
}

/**
 * countHandler returns translated comment counts using JSONP.
 */
export const countJSONPHandler =
  ({ mongo, i18n }: JSONPCountOptions): RequestHandler<TenantCoralRequest> =>
  async (req, res, next) => {
    try {
      const { tenant } = req.coral;

      // Ensure we have something to query with.
      const { id, url, ref }: StoryCountJSONPQuery = validate(
        StoryCountJSONPQuerySchema,
        req.query
      );

      // Try to query the story.
      const story = await find(mongo, tenant, {
        id,
        url,
      });

      const count = story ? await calculateStoryCount(mongo, story) : 0;

      const countHtml = `<span class="${NUMBER_CLASS_NAME}">COMMENT_COUNT</span>`;
      const textHtml = getTextHTML(tenant, story?.settings.mode, i18n, count);

      const data: CountJSONPData = {
        ref,
        countHtml,
        textHtml,
        count,
        id: story?.id || null,
      };

      // Respond using jsonp.
      res.jsonp(data);
    } catch (err) {
      return next(err);
    }
  };

export type CountOptions = Pick<AppOptions, "mongo" | "tenantCache">;

const StoryCountQuerySchema = Joi.object()
  .keys({
    id: Joi.string().optional(),
    url: Joi.string().optional(),
  })
  .or("id", "url");

type StoryCountQuery =
  | {
      id: string;
    }
  | {
      url: string;
    };

export const countHandler =
  ({ mongo }: CountOptions): RequestHandler<TenantCoralRequest> =>
  async (req, res, next) => {
    try {
      // Ensure we have something to query with.
      const query: StoryCountQuery = validate(StoryCountQuerySchema, req.query);

      // Try to query the story.
      const story = await find(mongo, req.coral.tenant, query);
      if (!story) {
        return res.json({ count: null });
      }

      const count = await calculateStoryCount(mongo, story);

      return res.json({ count });
    } catch (err) {
      return next(err);
    }
  };

async function calculateStoryCount(
  mongo: MongoContext,
  story: Readonly<Story>
) {
  if (story.settings.mode === GQLSTORY_MODE.RATINGS_AND_REVIEWS) {
    const tallies = await retrieveManyStoryRatings(mongo, story.tenantID, [
      story.id,
    ]);

    return tallies.length === 0 ? 0 : tallies[0].count;
  }

  return PUBLISHED_STATUSES.reduce(
    (total, status) => total + story.commentCounts.status[status],
    0
  );
}

export type CountV2Options = Pick<AppOptions, "mongo" | "redis">;

interface CountResult {
  storyID: string;
  redisCount?: number; // set if count came from redis
  mongoCount?: number; // set if count came from mongo
  count: number; // always set, can come from mongo or redis
}

export const computeCountKey = (tenantID: string, storyID: string) => {
  return `${tenantID}:${storyID}:count`;
};

export const countsV2Handler =
  ({ mongo, redis }: CountV2Options): RequestHandler<TenantCoralRequest> =>
  async (req, res, next) => {
    const { tenant } = req.coral;

    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).send("Authentication required");
      }

      if (!hasFeatureFlag(tenant, GQLFEATURE_FLAG.COUNTS_V2)) {
        return res.status(400).send("Counts V2 api not enabled");
      }

      const { storyIDs }: CountsV2Body = validate(CountsV2BodySchema, req.body);

      // grab what keys we can that are already in Redis with one bulk call
      const redisCounts = await redis.mget(
        ...storyIDs.map((id) => computeCountKey(tenant.id, id))
      );

      // quickly iterate over our results and see if we're missing any of the
      // values for our requested story id's
      const countResults = new Map<string, CountResult>();
      const missingIDs: string[] = [];
      for (let i = 0; i < storyIDs.length; i++) {
        const storyID = storyIDs[i];
        const redisCount = redisCounts[i];

        if (redisCount !== null && redisCount !== undefined) {
          try {
            const count = parseInt(redisCount, 10);
            countResults.set(storyID, { storyID, redisCount: count, count });
          } catch {
            missingIDs.push(storyID);
          }
        } else {
          missingIDs.push(storyID);
        }
      }

      // compute out the counts for any story id's we couldn't
      // get a count from Redis
      for (const missingID of missingIDs) {
        const count = await retrieveStoryCommentCounts(
          mongo,
          tenant.id,
          missingID
        );

        const key = computeCountKey(tenant.id, missingID);
        await redis.set(key, count, "EX", COUNTS_V2_CACHE_DURATION);
        logger.debug("set story count for counts v2 in redis cache", {
          storyID: missingID,
          count,
        });

        countResults.set(missingID, {
          storyID: missingID,
          mongoCount: count,
          count,
        });
      }

      // strictly follow the result set based on the story id's
      // we were given from the caller. Then return the values
      // from our combined redis/mongo results.
      //
      // this means if a user asked for id's ["1", "2", "3", "does-not-exist", "1"], they would
      // receive counts like so:
      // [
      //   { storyID: 1, redisCount: 2, count: 2 },
      //   { storyID: 2, redisCount: 5, count: 5 },
      //   { storyID: 3, mongoCount: 2, count: 2 },
      //   null,
      //   { storyID: 1, redisCount: 2, count: 2 }
      // ]
      //
      // many of our counts endpoints appreciate this adherence.
      const results: Array<CountResult | null> = [];
      for (const storyID of storyIDs) {
        const value = countResults.get(storyID) ?? null;
        results.push(value);
      }

      res.send(JSON.stringify(results));
    } catch (err) {
      return next(err);
    }
  };
