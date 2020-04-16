import {
  DailyCommentsJSON,
  DailyNewCommentersJSON,
  DailyTopStoriesJSON,
  HourlyCommentsJSON,
  HourlyNewCommentersJSON,
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
  retrieveDailyNewCommentersCount,
  retrieveHourlyNewCommentersCount,
} from "coral-server/services/users";
import { RequestHandler } from "coral-server/types/express";

type StatsOptions = Pick<AppOptions, "redis">;

export const dailyCommentStatsHandler = ({
  redis,
}: StatsOptions): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;

    try {
      const dailyCommentTotal = await retrieveDailyCommentTotal(
        redis,
        tenant.id,
        coral.now
      );
      const dailyStaffCommentTotal = await retrieveDailyStaffCommentTotal(
        redis,
        tenant.id,
        coral.now
      );
      /* eslint-disable-next-line */
      console.log(dailyCommentTotal, dailyStaffCommentTotal);

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

    try {
      const hourlyComments = await retrieveHourlyCommentTotal(
        redis,
        tenant.id,
        coral.now
      );
      const hourlyStaffComments = await retrieveHourlyStaffCommentTotal(
        redis,
        tenant.id,
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

export const dailyNewCommenterStatsHandler = ({
  redis,
}: StatsOptions): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;

    try {
      const newCommenters = await retrieveDailyNewCommentersCount(
        redis,
        tenant,
        coral.now
      );
      const json: DailyNewCommentersJSON = {
        newCommenters: {
          count: newCommenters,
        },
      };
      return res.json(json);
    } catch (err) {
      return next(err);
    }
  };
};

export const hourlyNewCommentersStatsHandler = ({
  redis,
}: StatsOptions): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;

    try {
      const hourlyCommenters = await retrieveHourlyNewCommentersCount(
        redis,
        tenant,
        coral.now
      );

      const json: HourlyNewCommentersJSON = {
        newCommenters: [],
      };
      for (const key of Object.keys(hourlyCommenters)) {
        json.newCommenters.push({
          hour: key,
          count: hourlyCommenters[key] || 0,
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

    try {
      const topStories = await retrieveDailyTopCommentedStories(
        mongo,
        redis,
        tenant.id,
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
