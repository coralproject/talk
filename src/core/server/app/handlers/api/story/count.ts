import Joi from "joi";

import { CountJSONPData } from "coral-common/types/count";
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
    notext: Joi.string().allow("true", "false").required(),
    ref: Joi.string().required(),
  })
  .or("id", "url");

interface StoryCountJSONPQuery {
  callback: string;
  id?: string;
  url?: string;
  notext: "true" | "false";
  ref: string;
}

function getCountHTML(
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
      `<span class="${NUMBER_CLASS_NAME}">${count}</span> <span class="${TEXT_CLASS_NAME}">Ratings</span>`,
      "comment-counts-ratings-and-reviews",
      {
        number: count,
        numberClass: NUMBER_CLASS_NAME,
        textClass: TEXT_CLASS_NAME,
      }
    );
  } else {
    html = translate(
      bundle,
      `<span class="${NUMBER_CLASS_NAME}">${count}</span> <span class="${TEXT_CLASS_NAME}">Comments</span>`,
      "comment-count",
      {
        number: count,
        numberClass: NUMBER_CLASS_NAME,
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
      const { id, url, notext, ref }: StoryCountJSONPQuery = validate(
        StoryCountJSONPQuerySchema,
        req.query
      );

      // Try to query the story.
      const story = await find(mongo, tenant, {
        id,
        url,
      });

      const count = story ? await calculateStoryCount(mongo, story) : 0;

      let html = "";
      if (notext === "true") {
        // We only need the count without the text.
        html = `<span class="${NUMBER_CLASS_NAME}">${count}</span>`;
      } else {
        html = getCountHTML(tenant, story?.settings.mode, i18n, count);
      }

      const data: CountJSONPData = {
        ref,
        html,
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
