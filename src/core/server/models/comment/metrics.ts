import { DateTime } from "luxon";
import { Db } from "mongodb";

import {
  formatTimeRangeSeries,
  getCount,
  getMongoFormat,
  getTimeRange,
  Result,
} from "coral-server/helpers/metrics";
import { comments as collection } from "coral-server/services/mongodb/collections";

import {
  GQLCOMMENT_STATUS,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

export async function retrieveHourlyCommentMetrics(
  mongo: Db,
  tenantID: string,
  siteID: string,
  timezone: string,
  now: Date
) {
  const { start, end } = getTimeRange("hour", timezone, now);

  // Return the last 24 hours (in hour documents).
  const results = await collection<Result>(mongo)
    .aggregate([
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
  mongo: Db,
  tenantID: string,
  siteID: string,
  timezone: string,
  now: Date
) {
  const start = DateTime.fromJSDate(now).setZone(timezone).startOf("day");
  const end = DateTime.fromJSDate(now);

  const status = await collection<{ _id: GQLCOMMENT_STATUS; count: number }>(
    mongo
  )
    .aggregate([
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

  const staff = await collection<{ count: number }>(mongo)
    .aggregate([
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
  mongo: Db,
  tenantID: string,
  siteID: string
) {
  // Get the referenced tenant, site, and staff comments.
  const staff = await collection<{ count: number }>(mongo)
    .aggregate([
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
  mongo: Db,
  tenantID: string,
  siteID: string,
  timezone: string,
  now: Date
) {
  const { start, hours, end } = getTimeRange("hour", timezone, now, 72);

  // Return the last 24 hours (in hour documents).
  const results = await collection<{ count: number }>(mongo)
    .aggregate([
      { $match: { tenantID, siteID, createdAt: { $gte: start, $lte: end } } },
      { $count: "count" },
    ])
    .toArray();

  const total = getCount(results);

  return Math.floor(total / hours);
}

export async function retrieveTodayTopStoryMetrics(
  mongo: Db,
  tenantID: string,
  siteID: string,
  timezone: string,
  now: Date
) {
  const start = DateTime.fromJSDate(now).setZone(timezone).startOf("day");
  const end = DateTime.fromJSDate(now);

  // Return the last 24 hours worth of comments.
  const results = await collection<Result>(mongo)
    .aggregate([
      { $match: { tenantID, siteID, createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: "$storyID",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 17 },
    ])
    .toArray();

  return results;
}
