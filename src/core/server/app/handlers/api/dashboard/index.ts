import {
  CommentStatusesJSON,
  DailyCommentsJSON,
  DailySignupsJSON,
  DailyTopStoriesJSON,
  HourlyCommentsJSON,
} from "coral-common/rest/dashboard/types";
import { AppOptions } from "coral-server/app";
import {
  retrieveDailyCommentTotal,
  retrieveDailyStaffCommentTotal,
  retrieveHourlyCommentTotal,
  retrieveHourlyStaffCommentTotal,
} from "coral-server/services/comments/stats";
import { retrieveDailyTopCommentedStories } from "coral-server/services/stories";
import {
  retrieveDailySignups,
  retrieveDailySignupsForWeek,
} from "coral-server/services/users";
import { RequestHandler } from "coral-server/types/express";

type StatsOptions = Pick<AppOptions, "redis">;

export const dailyCommentStatsHandler = ({
  redis,
}: StatsOptions): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;
    const site = req.site!;

    try {
      const dailyCommentTotal = await retrieveDailyCommentTotal(
        redis,
        tenant.id,
        site.id,
        coral.now
      );
      const dailyStaffCommentTotal = await retrieveDailyStaffCommentTotal(
        redis,
        tenant.id,
        site.id,
        coral.now
      );

      const resp: DailyCommentsJSON = {
        comments: {
          count: dailyCommentTotal,
          byAuthorRole: {
            staff: {
              count: dailyStaffCommentTotal,
            },
          },
        },
      };

      return res.json(resp);
    } catch (err) {
      return next(err);
    }
  };
};

export const hourlyCommentsStatsHandler = ({
  redis,
}: StatsOptions): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;
    const site = req.site!;

    try {
      const hourlyComments = await retrieveHourlyCommentTotal(
        redis,
        tenant.id,
        site.id,
        coral.now
      );
      const hourlyStaffComments = await retrieveHourlyStaffCommentTotal(
        redis,
        tenant.id,
        site.id,
        coral.now
      );
      const json: HourlyCommentsJSON = {
        comments: [],
      };
      for (const key of Object.keys(hourlyComments)) {
        json.comments.push({
          hour: key,
          count: hourlyComments[key] || 0,
          byAuthorRole: {
            staff: {
              count: hourlyStaffComments[key] || 0,
            },
          },
        });
      }
      return res.json(json);
    } catch (err) {
      return next(err);
    }
  };
};

type TopCommentedStatsOptions = Pick<AppOptions, "redis" | "mongo">;

export const topCommentedStoriesStatsHandler = ({
  redis,
  mongo,
}: TopCommentedStatsOptions): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;
    const site = req.site!;

    try {
      const topStories = await retrieveDailyTopCommentedStories(
        mongo,
        redis,
        tenant.id,
        site.id,
        coral.now
      );

      const json: DailyTopStoriesJSON = {
        topStories,
      };

      return res.json(json);
    } catch (err) {
      return next(err);
    }
  };
};

export const dailySignupsHandler = ({
  redis,
  mongo,
}: TopCommentedStatsOptions): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;

    try {
      const count = await retrieveDailySignups(mongo, tenant, coral.now);

      const json: DailySignupsJSON = {
        signups: {
          count,
        },
      };

      return res.json(json);
    } catch (err) {
      return next(err);
    }
  };
};

export const dailySignupsForWeekHandler = ({
  redis,
  mongo,
}: TopCommentedStatsOptions): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;

    try {
      const signups = await retrieveDailySignupsForWeek(
        mongo,
        redis,
        tenant,
        coral.now
      );

      const json: any = {
        signups,
      };

      return res.json(json);
    } catch (err) {
      return next(err);
    }
  };
};

export const commentStatuses: RequestHandler = (req, res, next) => {
  const site = req.site!;

  try {
    const { status } = site.commentCounts;
    const json: CommentStatusesJSON = {
      commentStatuses: {
        public: status.APPROVED + status.NONE,
        rejected: site.commentCounts.status.REJECTED,
        witheld: site.commentCounts.status.SYSTEM_WITHHELD,
      },
    };

    return res.json(json);
  } catch (err) {
    return next(err);
  }
};
