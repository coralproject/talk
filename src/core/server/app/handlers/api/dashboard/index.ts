import {
  BansTodayJSON,
  CommentsTodayJSON,
  DailyAverageCommentsJSON,
  DailyTopStoriesJSON,
  HourlyCommentsJSON,
  RejectedJSON,
  SignupsDailyJSON,
  SignupsJSON,
  UserBanStatusJSON,
} from "coral-common/rest/dashboard/types";
import { AppOptions } from "coral-server/app";
import {
  getSiteCommentCount,
  getSiteCommentCountByStatus,
} from "coral-server/models/site";
import {
  retrieveAverageCommentsPerDay,
  retrieveCommentsToday,
  retrieveHourlyCommentTotal,
  retrieveHourlyStaffCommentTotal,
  retrieveStaffCommentCount,
  retrieveStaffCommentsToday,
  retrievRejectionsToday,
} from "coral-server/services/comments";
import { retrieveDailyTopCommentedStories } from "coral-server/services/stories";
import {
  retrieveBanStatusCount,
  retrieveBansToday,
  retrieveSignupsForWeek,
  retrieveSignupsToday,
} from "coral-server/services/users";
import { RequestHandler } from "coral-server/types/express";

import { GQLCOMMENT_STATUS } from "coral-server/graph/schema/__generated__/types";

const DEFAULT_TIMEZONE = "America/New_York";

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
      const json: HourlyCommentsJSON = {
        hours: hourlyComments,
        byAuthorRole: {
          staff: {
            hours: hourlyStaffComments,
          },
        },
      };
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

      const json: SignupsJSON = {
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

      const json: RejectedJSON = {
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
    const site = req.site!;

    try {
      const json: RejectedJSON = {
        rejected: {
          count: getSiteCommentCountByStatus(site, GQLCOMMENT_STATUS.REJECTED),
        },
      };

      return res.json(json);
    } catch (err) {
      return next(err);
    }
  };
};

export const commentsAllTimeHandler = ({
  redis,
  mongo,
}: Pick<AppOptions, "redis" | "mongo">): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;
    const site = req.site!;

    try {
      const staff = await retrieveStaffCommentCount(
        mongo,
        redis,
        tenant.id,
        site.id
      );

      const resp = {
        comments: {
          count: getSiteCommentCount(site),
          byAuthorRole: {
            staff: {
              count: staff,
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

export const banStatusAllTimeHandler = ({
  redis,
  mongo,
}: Pick<AppOptions, "redis" | "mongo">): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;

    try {
      const { all, banned } = await retrieveBanStatusCount(
        mongo,
        redis,
        tenant.id
      );

      const resp: UserBanStatusJSON = {
        users: {
          count: all,
          banned: {
            count: banned,
          },
        },
      };

      return res.json(resp);
    } catch (err) {
      return next(err);
    }
  };
};

export const usersWeeklyHandler = ({
  redis,
  mongo,
}: Pick<AppOptions, "redis" | "mongo">): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;
    const zone = req.query.tz || DEFAULT_TIMEZONE;

    try {
      const signups = await retrieveSignupsForWeek(
        redis,
        tenant,
        zone,
        coral.now
      );

      const resp: SignupsDailyJSON = {
        signups: {
          days: signups,
        },
      };

      return res.json(resp);
    } catch (err) {
      return next(err);
    }
  };
};

export const commentsAverageHandler = ({
  redis,
  mongo,
}: Pick<AppOptions, "redis" | "mongo">): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;
    const site = req.site!;

    try {
      const average = await retrieveAverageCommentsPerDay(
        mongo,
        redis,
        tenant.id,
        site.id
      );

      const resp: DailyAverageCommentsJSON = {
        comments: {
          average,
        },
      };

      return res.json(resp);
    } catch (err) {
      return next(err);
    }
  };
};
