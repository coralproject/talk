import { DateTime } from "luxon";

import { isSiteModerator } from "coral-common/common/lib/permissions/types";
import { MongoContext } from "coral-server/data/context";
import {
  formatTimeRangeSeries,
  getCount,
  getMongoFormat,
  getTimeRange,
  Result,
} from "coral-server/helpers/metrics";

import {
  GQLCOMMENT_STATUS,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

import { PUBLISHED_STATUSES } from "./constants";
import { hasTag } from "./helpers";

export async function retrieveHourlyCommentMetrics(
  mongo: MongoContext,
  tenantID: string,
  siteID: string,
  timezone: string,
  now: Date
) {
  const { start, end } = getTimeRange("hour", timezone, now);

  // Return the last 24 hours (in hour documents).
  const results = await mongo
    .comments()
    .aggregate<Result>([
      { $match: { tenantID, siteID, createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: {
            $dateToString: {
              date: "$createdAt",
              format: getMongoFormat("hour"),
              timezone,
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();

  return formatTimeRangeSeries("hour", start, results);
}

export async function retrieveTodayCommentMetrics(
  mongo: MongoContext,
  tenantID: string,
  siteID: string,
  timezone: string,
  now: Date
) {
  const start = DateTime.fromJSDate(now).setZone(timezone).startOf("day");
  const end = DateTime.fromJSDate(now);

  const allCommentsInRange = mongo.comments().find({
    tenantID,
    siteID,
    createdAt: { $gte: start, $lte: end },
  });

  const visibleComments = new Set<string>();
  const rejectedComments = new Set<string>();
  const totalComments = new Set<string>();
  const staffComments = new Set<string>();

  const moderatorComments = new Map<string, Set<string>>();

  while (await allCommentsInRange.hasNext()) {
    const comment = await allCommentsInRange.next();
    if (!comment) {
      continue;
    }

    totalComments.add(comment.id);
    if (PUBLISHED_STATUSES.includes(comment.status)) {
      visibleComments.add(comment.id);
    }
    if (comment.status === GQLCOMMENT_STATUS.REJECTED) {
      rejectedComments.add(comment.id);
    }

    if (
      hasTag(comment, GQLTAG.STAFF) ||
      hasTag(comment, GQLTAG.ADMIN) ||
      hasTag(comment, GQLTAG.MODERATOR) ||
      hasTag(comment, GQLTAG.EXPERT)
    ) {
      staffComments.add(comment.id);
    }

    if (hasTag(comment, GQLTAG.MODERATOR) && comment.authorID) {
      if (!moderatorComments.has(comment.authorID)) {
        moderatorComments.set(comment.authorID, new Set<string>());
      }

      moderatorComments.get(comment.authorID)!.add(comment.id);
    }
  }

  const moderators = mongo
    .users()
    .find({ tenantID, id: { $in: Array.from(moderatorComments.keys()) } });

  let siteModsNotResponsibleForSiteCommentCount = 0;
  for await (const moderator of moderators) {
    if (!moderator) {
      continue;
    }

    const isSiteMod = isSiteModerator(moderator);
    if (isSiteMod && !moderator.moderationScopes.siteIDs?.includes(siteID)) {
      const count = moderatorComments.get(moderator.id)?.size ?? 0;
      siteModsNotResponsibleForSiteCommentCount += count;
    }
  }

  return {
    total: totalComments.size,
    rejected: rejectedComments.size,
    staff: staffComments.size - siteModsNotResponsibleForSiteCommentCount,
  };
}

export async function retrieveAllTimeStaffCommentMetrics(
  mongo: MongoContext,
  tenantID: string,
  siteID: string
) {
  // Get the referenced tenant, site, and staff comments.
  const comments = mongo.comments().find({
    tenantID,
    siteID,
    "tags.type": { $in: [GQLTAG.STAFF, GQLTAG.ADMIN, GQLTAG.MODERATOR] },
  });

  const staffComments = new Set<string>();
  const moderatorComments = new Map<string, Set<string>>();

  while (await comments.hasNext()) {
    const comment = await comments.next();
    if (!comment) {
      continue;
    }

    if (
      hasTag(comment, GQLTAG.STAFF) ||
      hasTag(comment, GQLTAG.ADMIN) ||
      hasTag(comment, GQLTAG.MODERATOR) ||
      hasTag(comment, GQLTAG.EXPERT)
    ) {
      staffComments.add(comment.id);
    }

    if (hasTag(comment, GQLTAG.MODERATOR) && comment.authorID) {
      if (!moderatorComments.has(comment.authorID)) {
        moderatorComments.set(comment.authorID, new Set<string>());
      }

      moderatorComments.get(comment.authorID)!.add(comment.id);
    }
  }

  const moderators = mongo
    .users()
    .find({ tenantID, id: { $in: Array.from(moderatorComments.keys()) } });

  let siteModsNotResponsibleForSiteCommentCount = 0;
  for await (const moderator of moderators) {
    if (!moderator) {
      continue;
    }

    const isSiteMod = isSiteModerator(moderator);
    if (isSiteMod && !moderator.moderationScopes.siteIDs?.includes(siteID)) {
      const count = moderatorComments.get(moderator.id)?.size ?? 0;
      siteModsNotResponsibleForSiteCommentCount += count;
    }
  }

  return staffComments.size - siteModsNotResponsibleForSiteCommentCount;
}

export async function retrieveAverageCommentsMetric(
  mongo: MongoContext,
  tenantID: string,
  siteID: string,
  timezone: string,
  now: Date
) {
  const { start, hours, end } = getTimeRange("hour", timezone, now, 72);

  // Return the last 24 hours (in hour documents).
  const results = await mongo
    .comments()
    .aggregate<{ count: number }>([
      { $match: { tenantID, siteID, createdAt: { $gte: start, $lte: end } } },
      { $count: "count" },
    ])
    .toArray();

  const total = getCount(results);

  return Math.floor(total / hours);
}

export async function retrieveTopStoryMetrics(
  mongo: MongoContext,
  tenantID: string,
  siteID: string,
  limit: number,
  start: Date,
  now: Date
) {
  const results = await mongo
    .comments()
    .aggregate<Result>([
      {
        $match: {
          tenantID,
          siteID,
          createdAt: { $gte: start, $lte: now },
          status: {
            $in: PUBLISHED_STATUSES,
          },
        },
      },
      {
        $group: {
          _id: "$storyID",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
    ])
    .toArray();

  return results;
}

export async function retrieveTodayTopStoryMetrics(
  mongo: MongoContext,
  tenantID: string,
  siteID: string,
  timezone: string,
  limit: number,
  now: Date
) {
  // Return the last day worth of comments.
  const start = DateTime.fromJSDate(now)
    .setZone(timezone)
    .startOf("day")
    .toJSDate();

  return retrieveTopStoryMetrics(mongo, tenantID, siteID, limit, start, now);
}
