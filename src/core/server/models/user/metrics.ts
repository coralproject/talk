import { DateTime } from "luxon";

import { MongoContext } from "coral-server/data/context";
import {
  formatTimeRangeSeries,
  getCount,
  getMongoFormat,
  getTimeRange,
  Result,
} from "coral-server/helpers/metrics";

export async function retrieveTodayUserMetrics(
  mongo: MongoContext,
  tenantID: string,
  timezone: string,
  now: Date
) {
  const start = DateTime.fromJSDate(now).setZone(timezone).startOf("day");
  const end = DateTime.fromJSDate(now);

  const [total, bans] = await Promise.all([
    mongo
      .users()
      .aggregate<{ count: number }>([
        { $match: { tenantID, createdAt: { $gte: start, $lte: end } } },
        { $count: "count" },
      ])
      .toArray(),
    mongo
      .users()
      .aggregate<{ count: number }>([
        {
          $match: {
            tenantID,
            "status.ban.active": true,
            "status.ban.history.createdAt": { $gte: start, $lte: end },
          },
        },
        { $count: "count" },
      ])
      .toArray(),
  ]);

  return {
    total: getCount(total),
    bans: getCount(bans),
  };
}

export async function retrieveAllTimeUserMetrics(
  mongo: MongoContext,
  tenantID: string
) {
  const [bans, total] = await Promise.all([
    mongo
      .users()
      .aggregate<{ count: number }>([
        { $match: { tenantID, "status.ban.active": true } },
        { $count: "count" },
      ])
      .toArray(),
    mongo
      .users()
      .aggregate<{ count: number }>([
        { $match: { tenantID } },
        { $count: "count" },
      ])
      .toArray(),
  ]);

  return {
    total: getCount(total),
    bans: getCount(bans),
  };
}

export async function retrieveDailyUserMetrics(
  mongo: MongoContext,
  tenantID: string,
  timezone: string,
  now: Date
) {
  const { start, end } = getTimeRange("day", timezone, now);

  // Return the last 7 days (in day documents).
  const results = await mongo
    .users()
    .aggregate<Result>([
      { $match: { tenantID, createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: {
            $dateToString: {
              date: "$createdAt",
              format: getMongoFormat("day"),
              timezone,
            },
          },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  return formatTimeRangeSeries("day", start, results);
}
