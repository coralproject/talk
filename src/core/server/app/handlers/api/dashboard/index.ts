import {
  BansTodayJSON,
  CommentsHourlyJSON,
  CommentStatusesJSON,
  CommentsTodayJSON,
  DailyTopStoriesJSON,
  SignupsDailyJSON,
  SignupsTodayJSON,
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
  countBanned,
  retrieveDailySignups,
  retrieveTodaySignups,
} from "coral-server/services/users";
import { RequestHandler } from "coral-server/types/express";

export const commentsTodayHandler = ({
  redis,
}: Pick<AppOptions, "redis">): RequestHandler => {
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

export const signupsTodayHandler = ({
  mongo,
}: Pick<AppOptions, "mongo">): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;

    try {
      const count = await retrieveTodaySignups(mongo, tenant, coral.now);

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

export const signupsDailyHandler = ({
  redis,
  mongo,
}: TopCommentedStatsOptions): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;

    try {
      const signups = await retrieveDailySignups(
        mongo,
        redis,
        tenant,
        coral.now
      );

      const json: SignupsDailyJSON = {
        signups,
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

    try {
      const count = await countBanned(mongo, redis, tenant.id, coral.now);

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
