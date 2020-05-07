import { Redis } from "ioredis";
import { Db } from "mongodb";

import {
  countAllByTagType,
  hourlyAverageComments,
} from "coral-server/models/comment";
import { User } from "coral-server/models/user";
import {
  CachedDbCount,
  CachedHourlyCount,
} from "coral-server/services/stats/helpers";

import {
  GQLTAG,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";

export interface DailyCommentCounts {
  total: number;
  staff: number;
}

function hourlyCommentsRejectedPrefix(tenantID: string, siteID: string) {
  return `stats:${tenantID}:${siteID}:rejections:`;
}

function hourlyCommentCountPrefix(tenantID: string, siteID: string) {
  return `stats:${tenantID}:${siteID}:comments`;
}

function hourlyStaffCommentCountPrefix(tenantID: string, siteID: string) {
  return `stats:${tenantID}:${siteID}:staffComments`;
}

function allTimeStaffCommentsKey(tenantID: string, siteID: string) {
  return `stats:${tenantID}:${siteID}:allTimeStaffComments`;
}

function commentsAverageKey(tenantID: string, siteID: string) {
  return `stats:${tenantID}:${siteID}:hourlyAverageComments`;
}

export function incrementCommentsToday(
  redis: Redis,
  tenantID: string,
  siteID: string,
  now: Date
) {
  const counter = new CachedHourlyCount(
    redis,
    hourlyCommentCountPrefix(tenantID, siteID)
  );
  return counter.increment(now);
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
    const counter = new CachedHourlyCount(
      redis,
      hourlyStaffCommentCountPrefix(tenantID, siteID)
    );
    return counter.increment(now);
  }
  return;
}

export function incrementRejectionsToday(
  redis: Redis,
  tenantID: string,
  siteID: string,
  now: Date
) {
  const counter = new CachedHourlyCount(
    redis,
    hourlyCommentsRejectedPrefix(tenantID, siteID)
  );
  return counter.increment(now);
}

export async function retrieveCommentsToday(
  redis: Redis,
  tenantID: string,
  siteID: string,
  zone: string,
  now: Date
) {
  const counter = new CachedHourlyCount(
    redis,
    hourlyCommentCountPrefix(tenantID, siteID)
  );
  return counter.retrieveDailyTotal(zone, now);
}

export async function retrievRejectionsToday(
  redis: Redis,
  tenantID: string,
  siteID: string,
  zone: string,
  now: Date
) {
  const counter = new CachedHourlyCount(
    redis,
    hourlyCommentsRejectedPrefix(tenantID, siteID)
  );
  return counter.retrieveDailyTotal(zone, now);
}

export async function retrieveStaffCommentsToday(
  redis: Redis,
  tenantID: string,
  siteID: string,
  zone: string,
  now: Date
) {
  const counter = new CachedHourlyCount(
    redis,
    hourlyStaffCommentCountPrefix(tenantID, siteID)
  );
  return counter.retrieveDailyTotal(zone, now);
}

export async function retrieveHourlyCommentTotal(
  redis: Redis,
  tenantID: string,
  siteID: string,
  now: Date
) {
  const counter = new CachedHourlyCount(
    redis,
    hourlyCommentCountPrefix(tenantID, siteID)
  );
  return counter.retrieveHourlyTotals(now);
}

export async function retrieveHourlyStaffCommentTotal(
  redis: Redis,
  tenantID: string,
  siteID: string,
  now: Date
) {
  const counter = new CachedHourlyCount(
    redis,
    hourlyStaffCommentCountPrefix(tenantID, siteID)
  );
  return counter.retrieveHourlyTotals(now);
}

export async function incrementStaffCommentCount(
  redis: Redis,
  tenantID: string,
  siteID: string
) {
  const counter = new CachedDbCount(redis, [
    allTimeStaffCommentsKey(tenantID, siteID),
  ]);
  return counter.increment();
}

export async function retrieveStaffCommentCount(
  mongo: Db,
  redis: Redis,
  tenantID: string,
  siteID: string
) {
  const counter = new CachedDbCount(redis, [
    allTimeStaffCommentsKey(tenantID, siteID),
  ]);

  const [total] = await counter.retrieveTotal(async () => {
    const [first] = await countAllByTagType(
      mongo,
      tenantID,
      siteID,
      GQLTAG.STAFF
    );
    if (first) {
      return [first.count];
    }
    return [0];
  });
  return total;
}

export async function retrieveAverageCommentsPerHour(
  mongo: Db,
  redis: Redis,
  tenantID: string,
  siteID: string
) {
  const counter = new CachedDbCount(
    redis,
    [commentsAverageKey(tenantID, siteID)],
    6 * 3600
  );

  const [avg] = await counter.retrieveTotal(async () => {
    const [dac] = await hourlyAverageComments(mongo, tenantID, siteID);
    return [dac.avg];
  });
  return avg;
}
