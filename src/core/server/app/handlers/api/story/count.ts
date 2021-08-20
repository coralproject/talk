import Joi from "joi";

import { CountJSONPData } from "coral-common/types/count";
import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { calculateTotalPublishedCommentCount } from "coral-server/models/comment";
import { translate } from "coral-server/services/i18n";
import { find } from "coral-server/services/stories";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

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

/**
 * countHandler returns translated comment counts using JSONP.
 */
export const countJSONPHandler = ({
  mongo,
  i18n,
}: JSONPCountOptions): RequestHandler<TenantCoralRequest> => async (
  req,
  res,
  next
) => {
  try {
    const { tenant } = req.coral;

    // Ensure we have something to query with.
    const { id, url, notext, ref }: StoryCountJSONPQuery = validate(
      StoryCountJSONPQuerySchema,
      req.query
    );

    // Try to query the story.
    const story = await find(mongo.main, tenant, {
      id,
      url,
    });

    const count = story
      ? calculateTotalPublishedCommentCount(story.commentCounts.status)
      : 0;

    let html = "";
    if (notext === "true") {
      // We only need the count without the text.
      html = `<span class="${NUMBER_CLASS_NAME}">${count}</span>`;
    } else {
      // Use translated string.
      const bundle = i18n.getBundle(tenant.locale);
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

export const countHandler = ({
  mongo,
}: CountOptions): RequestHandler<TenantCoralRequest> => async (
  req,
  res,
  next
) => {
  try {
    // Ensure we have something to query with.
    const query: StoryCountQuery = validate(StoryCountQuerySchema, req.query);

    // Try to query the story.
    const story = await find(mongo.main, req.coral.tenant, query);
    if (!story) {
      return res.json({ count: null });
    }

    const count = calculateTotalPublishedCommentCount(
      story.commentCounts.status
    );

    return res.json({ count });
  } catch (err) {
    return next(err);
  }
};
