import { DateTime } from "luxon";

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

  const status = await mongo
    .comments()
    .aggregate<{ _id: GQLCOMMENT_STATUS; count: number }>([
      {
        $match: {
          tenantID,
          siteID,
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const rejected = status.find((doc) => doc._id === GQLCOMMENT_STATUS.REJECTED);
  const total = status.reduce((acc, doc) => acc + doc.count, 0);

  const staff = await mongo
    .comments()
    .aggregate<{ count: number }>([
      {
        $match: {
          tenantID,
          siteID,
          createdAt: { $gte: start, $lte: end },
          "tags.type": GQLTAG.STAFF,
        },
      },
      { $count: "count" },
    ])
    .toArray();

  return {
    total,
    rejected: rejected ? rejected.count : 0,
    staff: getCount(staff),
  };
}

export async function retrieveAllTimeStaffCommentMetrics(
  mongo: MongoContext,
  tenantID: string,
  siteID: string
) {
  // Get the referenced tenant, site, and staff comments.
  const staff = await mongo
    .comments()
    .aggregate<{ count: number }>([
      {
        $match: {
          tenantID,
          siteID,
          "tags.type": GQLTAG.STAFF,
        },
      },
      { $count: "count" },
    ])
    .toArray();

  return getCount(staff);
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
