import { AppOptions } from "coral-server/app";
import {
  retrieveCommentsByStatus,
  retrieveDailyCommentTotal,
  retrieveDailyStaffCommentTotal,
  retrieveHourlyCommentTotal,
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
    // Tenant is guaranteed at this point.
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
      return res.json({
        comments: {
          total: dailyCommentTotal,
          staff: dailyStaffCommentTotal,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};

export const hourlyCommentsStatsHandler = ({
  redis,
}: StatsOptions): RequestHandler => {
  return async (req, res, next) => {
    // Tenant is guaranteed at this point.
    const coral = req.coral!;

    const tenant = coral.tenant!;

    try {
      const hourlyComments = await retrieveHourlyCommentTotal(
        redis,
        tenant.id,
        coral.now
      );
      return res.json({
        comments: {
          hourly: hourlyComments,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};

export const dailyNewCommenterStatsHandler = ({
  redis,
}: StatsOptions): RequestHandler => {
  return async (req, res, next) => {
    // Tenant is guaranteed at this point.
    const coral = req.coral!;

    const tenant = coral.tenant!;

    try {
      const newCommenters = await retrieveDailyNewCommentersCount(
        redis,
        tenant,
        coral.now
      );
      return res.json({
        commenters: newCommenters,
      });
    } catch (err) {
      return next(err);
    }
  };
};

export const hourlyNewCommentersStatsHandler = ({
  redis,
}: StatsOptions): RequestHandler => {
  return async (req, res, next) => {
    // Tenant is guaranteed at this point.
    const coral = req.coral!;

    const tenant = coral.tenant!;

    try {
      const hourlyCommenters = await retrieveHourlyNewCommentersCount(
        redis,
        tenant,
        coral.now
      );
      return res.json({
        commenters: {
          hourly: hourlyCommenters,
        },
      });
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
    // Tenant is guaranteed at this point.
    const coral = req.coral!;

    const tenant = coral.tenant!;

    try {
      const topStories = await retrieveDailyTopCommentedStories(
        mongo,
        redis,
        tenant.id,
        coral.now
      );

      return res.json({
        stories: topStories,
      });
    } catch (err) {
      return next(err);
    }
  };
};

export const commentStatuses = ({
  redis,
  mongo,
}: TopCommentedStatsOptions): RequestHandler => {
  return async (req, res, next) => {
    // Tenant is guaranteed at this point.
    const coral = req.coral!;

    const tenant = coral.tenant!;

    try {
      const topStories = await retrieveCommentsByStatus(
        mongo,
        tenant.id,
        coral.now
      );

      return res.json({
        stories: topStories,
      });
    } catch (err) {
      return next(err);
    }
  };
};
