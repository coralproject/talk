import { Response } from "express";
import Joi from "joi";

import { roundRating } from "coral-common/utils";
import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { retrieveStoryRatings } from "coral-server/models/comment";
import { resolveStoryMode } from "coral-server/models/story";
import { hasFeatureFlag } from "coral-server/models/tenant";
import { find } from "coral-server/services/stories";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

import {
  GQLFEATURE_FLAG,
  GQLSTORY_MODE,
} from "coral-server/graph/schema/__generated__/types";

const StoryRatingsQuerySchema = Joi.object()
  .keys({
    callback: Joi.string().allow("").optional(),
    id: Joi.string().optional(),
    url: Joi.string().optional(),
  })
  .or("id", "url");

interface StoryRatingsQuery {
  callback: string;
  id?: string;
  url?: string;
}

interface StoryRatingsData {
  story: {
    id: string;
    url: string;
    ratings: {
      average: number;
      count: number;
    };
  } | null;
}

function respond(res: Response, story: StoryRatingsData["story"]) {
  res.jsonp({
    story: story
      ? {
          id: story.id,
          url: story.url,
          ratings: {
            average: roundRating(story.ratings.average),
            count: story.ratings.count,
          },
        }
      : null,
  });
}

export const ratingsJSONPHandler =
  ({ mongo }: AppOptions): RequestHandler<TenantCoralRequest> =>
  async (req, res, next) => {
    const { tenant } = req.coral;

    try {
      // Ensure the feature flag is enabled.
      if (!hasFeatureFlag(tenant, GQLFEATURE_FLAG.ENABLE_RATINGS_AND_REVIEWS)) {
        return respond(res, null);
      }

      // Ensure we have something to query with.
      const { id, url }: StoryRatingsQuery = validate(
        StoryRatingsQuerySchema,
        req.query
      );

      const story = await find(mongo, tenant, {
        id,
        url,
      });
      if (!story) {
        return respond(res, null);
      }

      if (
        resolveStoryMode(story.settings, tenant) !==
        GQLSTORY_MODE.RATINGS_AND_REVIEWS
      ) {
        return respond(res, null);
      }

      const ratings = await retrieveStoryRatings(mongo, tenant.id, story.id);

      return respond(res, { id: story.id, url: story.url, ratings });
    } catch (err) {
      return res.status(400).end();
    }
  };
