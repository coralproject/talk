import { Redis } from "ioredis";
import { DateTime } from "luxon";

import { User } from "coral-server/models/user";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

export interface DailyCommentCounts {
  total: number;
  staff: number;
}

function dailyCommentCountKey(tenantID: string, today: number) {
  return `stats:${tenantID}:dailyCommentCount:${today}`;
}

function hourlyCommentCountKey(tenantID: string, hour: number) {
  return `stats:${tenantID}:hourlyCommentCount:${hour}`;
}

function dailyStaffCommentCountKey(tenantID: string, today: number) {
  return `stats:${tenantID}:dailyStaffCommentCount:${today}`;
}

function hourlyStaffCommentCountKey(tenantID: string, hour: number) {
  return `stats:${tenantID}:hourlyStaffCommentCount:${hour}`;
}

export async function updateCommentTotals(
  redis: Redis,
  tenantID: string,
  now: Date
) {
  const today = DateTime.fromJSDate(now)
    .startOf("day")
    .toSeconds();
  const hour = DateTime.fromJSDate(now).startOf("hour").hour;
  const expireHourly = DateTime.fromJSDate(now)
    .startOf("hour")
    .plus({ days: 1 })
    .toSeconds();
  const expireDaily = DateTime.fromJSDate(now)
    .endOf("day")
    .toSeconds();

  const dailyKey = dailyCommentCountKey(tenantID, today);
  const hourlyKey = hourlyCommentCountKey(tenantID, hour);

  return redis
    .multi()
    .incr(dailyKey)
    .incr(hourlyKey)
    .expireat(dailyKey, expireDaily)
    .expireat(hourlyKey, expireHourly)
    .exec();
}

export async function updateStaffCommentTotals(
  redis: Redis,
  tenantID: string,
  user: Pick<User, "role">,
  now: Date
) {
  if (
    [GQLUSER_ROLE.ADMIN, GQLUSER_ROLE.MODERATOR, GQLUSER_ROLE.STAFF].includes(
      user.role
    )
  ) {
    const today = DateTime.fromJSDate(now)
      .startOf("day")
      .toSeconds();
    const hour = DateTime.fromJSDate(now).startOf("hour").hour;
    const expireHourly = DateTime.fromJSDate(now)
      .startOf("hour")
      .plus({ days: 1 })
      .toSeconds();
    const expireDaily = DateTime.fromJSDate(now)
      .endOf("day")
      .toSeconds();

    const dailyKey = dailyStaffCommentCountKey(tenantID, today);
    const hourlyKey = hourlyStaffCommentCountKey(tenantID, hour);

    return redis
      .multi()
      .incr(dailyKey)
      .incr(hourlyKey)
      .expireat(dailyKey, expireDaily)
      .expireat(hourlyKey, expireHourly)
      .exec();
  }
  return;
}

export async function retrieveDailyCommentTotal(
  redis: Redis,
  tenantID: string,
  now: Date
) {
  const today = DateTime.fromJSDate(now)
    .startOf("day")
    .toSeconds();
  const key = dailyCommentCountKey(tenantID, today);
  const result = await redis.get(key);
  return result;
}

export async function retrieveDailyStaffCommentTotal(
  redis: Redis,
  tenantID: string,
  now: Date
) {
  const today = DateTime.fromJSDate(now)
    .startOf("day")
    .toSeconds();
  const key = dailyStaffCommentCountKey(tenantID, today);
  const result = await redis.get(key);
  return result;
}
