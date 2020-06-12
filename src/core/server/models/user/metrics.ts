import { DateTime } from "luxon";
import { Db } from "mongodb";

import {
  formatTimeRangeSeries,
  getCount,
  getMongoFormat,
  getTimeRange,
  Result,
} from "coral-server/helpers/metrics";
import { users as collection } from "coral-server/services/mongodb/collections";

export async function retrieveTodayUserMetrics(
  mongo: Db,
  tenantID: string,
  timezone: string,
  now: Date
) {
  const start = DateTime.fromJSDate(now).setZone(timezone).startOf("day");
  const end = DateTime.fromJSDate(now);

  const [total, bans] = await Promise.all([
    collection<{ count: number }>(mongo)
      .aggregate([
        { $match: { tenantID, createdAt: { $gte: start, $lte: end } } },
        { $count: "count" },
      ])
      .toArray(),
    collection<{ count: number }>(mongo)
      .aggregate([
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

export async function retrieveAllTimeUserMetrics(mongo: Db, tenantID: string) {
  const [bans, total] = await Promise.all([
    collection<{ count: number }>(mongo)
      .aggregate([
        { $match: { tenantID, "status.ban.active": true } },
        { $count: "count" },
      ])
      .toArray(),
    collection<{ count: number }>(mongo)
      .aggregate([{ $match: { tenantID } }, { $count: "count" }])
      .toArray(),
  ]);

  return {
    total: getCount(total),
    bans: getCount(bans),
  };
}

export async function retrieveDailyUserMetrics(
  mongo: Db,
  tenantID: string,
  timezone: string,
  now: Date
) {
  const { start, end } = getTimeRange("day", timezone, now);

  // Return the last 7 days (in day documents).
  const results = await collection<Result>(mongo)
    .aggregate([
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
