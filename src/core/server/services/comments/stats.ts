import { Redis } from "ioredis";
import { Db } from "mongodb";

import { countAllByTagType } from "coral-server/models/comment";
import { User } from "coral-server/models/user";
import {
  incrementHourlyCount,
  retrieveDailyTotal,
  retrieveHourlyTotals,
} from "coral-server/services/stats/helpers";

import {
  GQLTAG,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";

export interface DailyCommentCounts {
  total: number;
  staff: number;
}

function hourlyCommentsRejectedKey(
  tenantID: string,
  siteID: string,
  hour: number
) {
  return `stats:${tenantID}:${siteID}:hourlyRejectionCount:${hour}`;
}

function hourlyCommentCountKey(tenantID: string, siteID: string, hour: number) {
  return `stats:${tenantID}:${siteID}:hourlyCommentCount:${hour}`;
}

function hourlyStaffCommentCountKey(
  tenantID: string,
  siteID: string,
  hour: number
) {
  return `stats:${tenantID}:${siteID}:hourlyStaffCommentCount:${hour}`;
}

export function incrementCommentsToday(
  redis: Redis,
  tenantID: string,
  siteID: string,
  now: Date
) {
  return incrementHourlyCount(
    redis,
    tenantID,
    siteID,
    now,
    hourlyCommentCountKey
  );
}

export function incrementStaffCommentsToday(
  redis: Redis,
  tenantID: string,
  siteID: string,
  user: Pick<User, "role">,
  now: Date
) {
  if (
    [GQLUSER_ROLE.ADMIN, GQLUSER_ROLE.MODERATOR, GQLUSER_ROLE.STAFF].includes(
      user.role
    )
  ) {
    return incrementHourlyCount(
      redis,
      tenantID,
      siteID,
      now,
      hourlyStaffCommentCountKey
    );
  }
  return;
}

export function incrementRejectionsToday(
  redis: Redis,
  tenantID: string,
  siteID: string,
  now: Date
) {
  return incrementHourlyCount(
    redis,
    tenantID,
    siteID,
    now,
    hourlyCommentsRejectedKey
  );
}

export async function retrieveCommentsToday(
  redis: Redis,
  tenantID: string,
  siteID: string,
  zone: string,
  now: Date
) {
  return retrieveDailyTotal(
    redis,
    tenantID,
    siteID,
    zone,
    now,
    hourlyCommentCountKey
  );
}

export async function retrievRejectionsToday(
  redis: Redis,
  tenantID: string,
  siteID: string,
  zone: string,
  now: Date
) {
  return retrieveDailyTotal(
    redis,
    tenantID,
    siteID,
    zone,
    now,
    hourlyCommentsRejectedKey
  );
}

export async function retrieveStaffCommentsToday(
  redis: Redis,
  tenantID: string,
  siteID: string,
  zone: string,
  now: Date
) {
  return retrieveDailyTotal(
    redis,
    tenantID,
    siteID,
    zone,
    now,
    hourlyStaffCommentCountKey
  );
}

export async function retrieveHourlyCommentTotal(
  redis: Redis,
  tenantID: string,
  siteID: string,
  now: Date
) {
  return retrieveHourlyTotals(
    redis,
    tenantID,
    siteID,
    now,
    hourlyCommentCountKey
  );
}

export async function retrieveHourlyStaffCommentTotal(
  redis: Redis,
  tenantID: string,
  siteID: string,
  now: Date
) {
  return retrieveHourlyTotals(
    redis,
    tenantID,
    siteID,
    now,
    hourlyStaffCommentCountKey
  );
}

function allTimeStaffCommentsKey(tenantID: string, siteID: string) {
  return `stats:${tenantID}:${siteID}:allTimeStaffComments`;
}

export async function incrementStaffCommentCount(
  redis: Redis,
  tenantID: string,
  siteID: string
) {
  const countKey = allTimeStaffCommentsKey(tenantID, siteID);

  return redis.incr(countKey);
}

export async function retrieveStaffCommentCount(
  mongo: Db,
  redis: Redis,
  tenantID: string,
  siteID: string
) {
  const countKey = allTimeStaffCommentsKey(tenantID, siteID);
  const cachedCount = await redis.get(countKey);
  if (cachedCount) {
    return parseInt(cachedCount, 10);
  }
  const expiry = 3 * 3600;

  const [{ count }] = await countAllByTagType(
    mongo,
    tenantID,
    siteID,
    GQLTAG.STAFF
  );
  await redis.set(countKey, count, "EX", expiry);
  return count;
}
