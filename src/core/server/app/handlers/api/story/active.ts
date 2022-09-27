import Joi from "joi";
import { DateTime } from "luxon";

import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { calculateTotalPublishedCommentCount } from "coral-server/models/comment";
import { retrieveTopStoryMetrics } from "coral-server/models/comment/metrics";
import { retrieveSite } from "coral-server/models/site";
import { retrieveManyStories, Story } from "coral-server/models/story";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

export type Options = Pick<AppOptions, "mongo">;

const ActiveStoriesQuerySchema = Joi.object().keys({
  callback: Joi.string().allow("").optional(),
  siteID: Joi.string().required(),
});

interface ActiveStoriesQuery {
  callback: string;
  siteID: string;
}

/**
 * ActiveHandlerResponse is part of the Active Stories API. Changes to this
 * interface should be completed only after a deprecation cycle.
 */
interface ActiveHandlerResponse {
  stories: Array<{
    id: string;
    url: string;
    title: string | null;
    image: string | null;
    publishedAt: Date | null;
    count: number;
  }>;
}

export const activeJSONPHandler =
  ({ mongo }: Options): RequestHandler<TenantCoralRequest> =>
  async (req, res, next) => {
    try {
      // Grab the Tenant.
      const { tenant, now } = req.coral;

      // Ensure we have a siteID on the query.
      const { siteID }: ActiveStoriesQuery = validate(
        ActiveStoriesQuerySchema,
        req.query
      );

      // Check to see that this site does exist for this Tenant.
      const site = await retrieveSite(mongo, tenant.id, siteID);
      if (!site) {
        throw new Error("site not found");
      }

      // Find top active stories in the last 24 hours.
      const start = DateTime.fromJSDate(now).minus({ hours: 24 }).toJSDate();
      const results = await retrieveTopStoryMetrics(
        mongo,
        tenant.id,
        siteID,
        5,
        start,
        now
      );

      // Fetch all the stories for each count. This will be returned in the same
      // ordering of the counts.
      const stories = await retrieveManyStories(
        mongo,
        tenant.id,
        results.map(({ _id }) => _id)
      );

      // Ensure that all entries are not null.
      if (
        !stories.every((story) => story) ||
        results.length !== stories.length
      ) {
        throw new Error("some stories with comments were not found");
      }

      // Generate the response using the existing order of the stories.
      const response: ActiveHandlerResponse = {
        // We verified above that there was no null stories in the array.
        stories: (stories as Story[]).map(
          ({ id, url, metadata, commentCounts }) => ({
            id,
            url,
            title: metadata?.title || null,
            image: metadata?.image || null,
            publishedAt: metadata?.publishedAt || null,
            count: calculateTotalPublishedCommentCount(commentCounts.status),
          })
        ),
      };

      // Respond using jsonp.
      return res.jsonp(response);
    } catch (err) {
      return next(err);
    }
  };
