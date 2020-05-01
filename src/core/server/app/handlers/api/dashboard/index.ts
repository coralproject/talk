import {
  CountersJSON,
  DailySignupsJSON,
  DailyTopStoriesJSON,
  HourlyCommentsJSON,
} from "coral-common/rest/dashboard/types";
import { AppOptions } from "coral-server/app";
import {
  getSiteCommentCount,
  getSiteCommentCountByStatus,
} from "coral-server/models/site";
import {
  retrieveAverageCommentsPerHour,
  retrieveCommentsToday,
  retrieveHourlyCommentTotal,
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

export const topCommentedStoriesHandler = ({
  redis,
  mongo,
}: Pick<AppOptions, "redis" | "mongo">): RequestHandler => {
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

export const todayCountersHandler = ({
  redis,
}: Pick<AppOptions, "redis" | "mongo">): RequestHandler => {
  return async (req, res, next) => {
    try {
      const coral = req.coral!;
      const tenant = coral.tenant!;
      const site = req.site!;
      const zone = req.query.tz || DEFAULT_TIMEZONE;

      const comments = await retrieveCommentsToday(
        redis,
        tenant.id,
        site.id,
        zone,
        coral.now
      );
      const staffComments = await retrieveStaffCommentsToday(
        redis,
        tenant.id,
        site.id,
        zone,
        coral.now
      );
      const signups = await retrieveSignupsToday(
        redis,
        tenant,
        zone,
        coral.now
      );

      const rejections = await retrievRejectionsToday(
        redis,
        tenant.id,
        site.id,
        zone,
        coral.now
      );
      const bans = await retrieveBansToday(redis, tenant.id, zone, coral.now);

      const resp: CountersJSON = {
        counts: {
          comments,
          staffComments,
          signups,
          rejections,
          bans,
        },
      };

      return res.json(resp);
    } catch (err) {
      return next(err);
    }
  };
};

export const allTimeCountersHandler = ({
  redis,
  mongo,
}: Pick<AppOptions, "redis" | "mongo">): RequestHandler => {
  return async (req, res, next) => {
    try {
      const coral = req.coral!;
      const tenant = coral.tenant!;
      const site = req.site!;
      const comments = getSiteCommentCount(site);
      const rejections = getSiteCommentCountByStatus(
        site,
        GQLCOMMENT_STATUS.REJECTED
      );
      const staffComments = await retrieveStaffCommentCount(
        mongo,
        redis,
        tenant.id,
        site.id
      );
      const { all, banned } = await retrieveBanStatusCount(
        mongo,
        redis,
        tenant.id
      );

      const resp: CountersJSON = {
        counts: {
          comments,
          staffComments,
          signups: all,
          rejections,
          bans: banned,
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
  mongo,
}: Pick<AppOptions, "redis" | "mongo">): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;
    const site = req.site!;

    try {
      const counts = await retrieveHourlyCommentTotal(
        redis,
        tenant.id,
        site.id,
        coral.now
      );
      const average = await retrieveAverageCommentsPerHour(
        mongo,
        redis,
        tenant.id,
        site.id
      );
      const json: HourlyCommentsJSON = {
        counts,
        average,
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

      const resp: DailySignupsJSON = {
        counts: signups,
      };

      return res.json(resp);
    } catch (err) {
      return next(err);
    }
  };
};
