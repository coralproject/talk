import {
  TimeSeriesMetricsJSON,
  TodayMetricsJSON,
  TodayStoriesMetricsJSON,
} from "coral-common/types/dashboard";
import { AppOptions } from "coral-server/app";
import { calculateTotalCommentCount } from "coral-server/models/comment";
import {
  retrieveAllTimeStaffCommentMetrics,
  retrieveAverageCommentsMetric,
  retrieveHourlyCommentMetrics,
  retrieveTodayCommentMetrics,
  retrieveTodayTopStoryMetrics,
} from "coral-server/models/comment/metrics";
import { retrieveSite } from "coral-server/models/site";
import { retrieveManyStories } from "coral-server/models/story";
import {
  retrieveAllTimeUserMetrics,
  retrieveDailyUserMetrics,
  retrieveTodayUserMetrics,
} from "coral-server/models/user/metrics";
import {
  Request,
  RequestHandler,
  TenantCoralRequest,
} from "coral-server/types/express";

function getMetricsOptions(req: Request<TenantCoralRequest>) {
  // Get the current Tenant on the request.
  const { id: tenantID } = req.coral.tenant;

  const now = req.coral.now;

  // To set a fixed date for the date, uncomment the line below.
  // const now = DateTime.utc(2020, 5, 5, 12, 30).toJSDate();

  // To allow for date overrides (to load metrics for another time then now),
  // uncomment the lines below.
  // const { date = req.coral?.now!.toISOString() } = req.query;
  // const now = new Date(date);

  // Get the Site ID and timezone for this set of metrics.
  const { siteID, tz } = req.query;
  if (!tz) {
    throw new Error("tz was not provided");
  }

  return { tenantID, siteID, tz, now };
}

export const todayMetricsHandler =
  ({ mongo }: AppOptions): RequestHandler<TenantCoralRequest> =>
  async (req, res, next) => {
    try {
      const { tenantID, siteID, tz, now } = getMetricsOptions(req);
      if (!siteID) {
        throw new Error("siteID was not provided");
      }

      const [users, comments] = await Promise.all([
        retrieveTodayUserMetrics(mongo, tenantID, tz, now),
        retrieveTodayCommentMetrics(mongo, tenantID, siteID, tz, now),
      ]);

      const result: TodayMetricsJSON = {
        users,
        comments,
      };

      return res.json(result);
    } catch (err) {
      return next(err);
    }
  };

export const totalMetricsHandler =
  ({ mongo }: AppOptions): RequestHandler<TenantCoralRequest> =>
  async (req, res, next) => {
    try {
      const { tenantID, siteID } = getMetricsOptions(req);
      if (!siteID) {
        throw new Error("siteID was not provided");
      }

      const site = await retrieveSite(mongo, tenantID, siteID);
      if (!site) {
        throw new Error("site specified was not found");
      }

      const [users, staff] = await Promise.all([
        retrieveAllTimeUserMetrics(mongo, tenantID),
        retrieveAllTimeStaffCommentMetrics(mongo, tenantID, siteID),
      ]);

      const result: TodayMetricsJSON = {
        users,
        comments: {
          total: calculateTotalCommentCount(site.commentCounts.status),
          rejected: site.commentCounts.status.REJECTED,
          staff,
        },
      };

      return res.json(result);
    } catch (err) {
      return next(err);
    }
  };

export const hourlyCommentsMetricsHandler =
  ({ mongo }: AppOptions): RequestHandler<TenantCoralRequest> =>
  async (req, res, next) => {
    try {
      const { tenantID, siteID, tz, now } = getMetricsOptions(req);
      if (!siteID) {
        throw new Error("siteID was not provided");
      }

      const [series, average] = await Promise.all([
        retrieveHourlyCommentMetrics(mongo, tenantID, siteID, tz, now),
        retrieveAverageCommentsMetric(mongo, tenantID, siteID, tz, now),
      ]);

      const result: TimeSeriesMetricsJSON = {
        series,
        average,
      };

      return res.json(result);
    } catch (err) {
      return next(err);
    }
  };

export const dailyUsersMetricsHandler =
  ({ mongo }: AppOptions): RequestHandler<TenantCoralRequest> =>
  async (req, res, next) => {
    try {
      const { tenantID, tz, now } = getMetricsOptions(req);

      const result: TimeSeriesMetricsJSON = {
        series: await retrieveDailyUserMetrics(mongo, tenantID, tz, now),
      };

      return res.json(result);
    } catch (err) {
      return next(err);
    }
  };

export const todayStoriesMetricsHandler =
  ({ mongo }: AppOptions): RequestHandler<TenantCoralRequest> =>
  async (req, res, next) => {
    try {
      const { tenantID, siteID, tz, now } = getMetricsOptions(req);
      if (!siteID) {
        throw new Error("siteID was not provided");
      }

      const results = await retrieveTodayTopStoryMetrics(
        mongo,
        tenantID,
        siteID,
        tz,
        20,
        now
      );

      // Fetch all the stories for each count.
      const stories = await retrieveManyStories(
        mongo,
        tenantID,
        results.map(({ _id }) => _id)
      );

      // Ensure that all entries are not null.
      if (
        !stories.every((story) => story) ||
        results.length !== stories.length
      ) {
        throw new Error("some stories with comments were not found");
      }

      const result: TodayStoriesMetricsJSON = {
        results: results.map(({ count }, idx) => {
          // We verified above that there were no null values.
          const story = stories[idx]!;

          return {
            count,
            story: { id: story.id, title: story.metadata?.title },
          };
        }),
      };

      return res.json(result);
    } catch (err) {
      return next(err);
    }
  };
