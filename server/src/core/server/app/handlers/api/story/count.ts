import Joi from "joi";

import { CountJSONPData } from "coral-common/common/lib/types/count";
import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { MongoContext } from "coral-server/data/context";
import { retrieveManyStoryRatings } from "coral-server/models/comment";
import { PUBLISHED_STATUSES } from "coral-server/models/comment/constants";
import { Story } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { I18n, translate } from "coral-server/services/i18n";
import { find } from "coral-server/services/stories";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

import { GQLSTORY_MODE } from "coral-server/graph/schema/__generated__/types";

const NUMBER_CLASS_NAME = "coral-count-number";
const TEXT_CLASS_NAME = "coral-count-text";

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

function getTextHTML(
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
