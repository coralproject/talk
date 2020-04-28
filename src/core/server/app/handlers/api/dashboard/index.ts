import {
  BansTodayJSON,
  CommentsAllTimeJSON,
  CommentsHourlyJSON,
  CommentStatusesJSON,
  CommentsTodayJSON,
  DailyTopStoriesJSON,
  RejectedTodayJSON,
  SignupsTodayJSON,
} from "coral-common/rest/dashboard/types";
import { AppOptions } from "coral-server/app";
import {
  retrieveCommentsToday,
  retrieveHourlyCommentTotal,
  retrieveHourlyStaffCommentTotal,
  retrieveStaffCommentsToday,
  retrievRejectionsToday,
  totalComments,
  totalRejected,
  totalStaffComments,
} from "coral-server/services/comments";
import { retrieveDailyTopCommentedStories } from "coral-server/services/stories";
import {
  retrieveBansToday,
  retrieveSignupsToday,
} from "coral-server/services/users";
import { RequestHandler } from "coral-server/types/express";

const DEFAULT_TIMEZONE = "America/New_York";

export const commentsHandler = ({
  redis,
  mongo,
}: Pick<AppOptions, "redis" | "mongo">): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;
    const site = req.site!;
    const zone = req.query.tz || DEFAULT_TIMEZONE;

    try {
      const total = await totalComments(
        redis,
        mongo,
        tenant.id,
        site.id,
        zone,
        coral.now
      );
      const staffTotal = await totalStaffComments(
        redis,
        mongo,
        tenant.id,
        site.id,
        zone,
        coral.now
      );

      const resp: CommentsAllTimeJSON = {
        comments: {
          count: total,
          byAuthorRole: {
            staff: {
              count: staffTotal,
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

export const commentsTodayHandler = ({
  redis,
}: Pick<AppOptions, "redis">): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;
    const site = req.site!;
    const zone = req.query.tz || DEFAULT_TIMEZONE;

    try {
      const dailyCommentTotal = await retrieveCommentsToday(
        redis,
        tenant.id,
        site.id,
        zone,
        coral.now
      );
      const dailyStaffCommentTotal = await retrieveStaffCommentsToday(
        redis,
        tenant.id,
        site.id,
        zone,
        coral.now
      );

      const resp: CommentsTodayJSON = {
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

export const commentsHourlyHandler = ({
  redis,
}: Pick<AppOptions, "redis">): RequestHandler => {
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
      const json: CommentsHourlyJSON = {
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

export const topCommentedStoriesHandler = ({
  redis,
  mongo,
}: TopCommentedStatsOptions): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;
    const site = req.site!;
    const zone = req.query.tz || DEFAULT_TIMEZONE;

    try {
      const topStories = await retrieveDailyTopCommentedStories(
        mongo,
        redis,
        tenant.id,
        site.id,
        zone,
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

export const signupsTodayHandler = ({
  redis,
}: Pick<AppOptions, "redis">): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;
    const zone = req.query.tz || DEFAULT_TIMEZONE;

    try {
      const count = await retrieveSignupsToday(redis, tenant, zone, coral.now);

      const json: SignupsTodayJSON = {
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

export const bansTodayHandler = ({
  redis,
  mongo,
}: TopCommentedStatsOptions): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;
    const zone = req.query.tz || DEFAULT_TIMEZONE;

    try {
      const count = await retrieveBansToday(redis, tenant.id, zone, coral.now);

      const json: BansTodayJSON = {
        banned: {
          count,
        },
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
        other: status.APPROVED + status.NONE + status.PREMOD,
        rejected: site.commentCounts.status.REJECTED,
        witheld: site.commentCounts.status.SYSTEM_WITHHELD,
      },
    };

    return res.json(json);
  } catch (err) {
    return next(err);
  }
};

export const rejectedTodayHandler = ({
  redis,
}: TopCommentedStatsOptions): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;
    const zone = req.query.tz || DEFAULT_TIMEZONE;
    const site = req.site!;

    try {
      const count = await retrievRejectionsToday(
        redis,
        tenant.id,
        site.id,
        zone,
        coral.now
      );

      const json: RejectedTodayJSON = {
        rejected: {
          count,
        },
      };

      return res.json(json);
    } catch (err) {
      return next(err);
    }
  };
};

export const rejectedAllTimeHandler = ({
  redis,
  mongo,
}: Pick<AppOptions, "redis" | "mongo">): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;
    const zone = req.query.tz || DEFAULT_TIMEZONE;
    const site = req.site!;

    try {
      const count = await totalRejected(
        redis,
        mongo,
        tenant.id,
        site.id,
        zone,
        coral.now
      );

      const json: RejectedTodayJSON = {
        rejected: {
          count,
        },
      };

      return res.json(json);
    } catch (err) {
      return next(err);
    }
  };
};
