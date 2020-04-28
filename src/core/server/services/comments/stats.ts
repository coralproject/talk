import { Redis } from "ioredis";
import { DateTime } from "luxon";
import { Db } from "mongodb";

import {
  countRejectedUntil,
  countStaffCommentsUntil,
  countUntil,
} from "coral-server/models/comment";
import { User } from "coral-server/models/user";
import {
  incrementHourlyCount,
  retrieveDailyTotal,
  retrieveHourlyTotals,
} from "coral-server/services/stats/helpers";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

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

export async function totalComments(
  redis: Redis,
  mongo: Db,
  tenantID: string,
  siteID: string,
  zone: string,
  now: Date
) {
  const startOfDay = DateTime.fromJSDate(now).setZone(zone).startOf("day");
  return countUntil(mongo, tenantID, siteID, startOfDay.toJSDate());
}

export async function totalStaffComments(
  redis: Redis,
  mongo: Db,
  tenantID: string,
  siteID: string,
  zone: string,
  now: Date
) {
  const startOfDay = DateTime.fromJSDate(now).setZone(zone).startOf("day");
  return countStaffCommentsUntil(
    mongo,
    tenantID,
    siteID,
    startOfDay.toJSDate()
  );
}

export async function totalRejected(
  redis: Redis,
  mongo: Db,
  tenantID: string,
  siteID: string,
  zone: string,
  now: Date
) {
  const startOfDay = DateTime.fromJSDate(now).setZone(zone).startOf("day");
  return countRejectedUntil(mongo, tenantID, siteID, startOfDay.toJSDate());
}
