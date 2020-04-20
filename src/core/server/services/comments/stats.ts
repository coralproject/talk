import { Redis } from "ioredis";

import { User } from "coral-server/models/user";
import {
  retrieveDailyTotal,
  retrieveHourlyTotals,
  updateDailyCount,
  updateHourlyCount,
} from "coral-server/services/stats/helpers";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

export interface DailyCommentCounts {
  total: number;
  staff: number;
}

function dailyCommentCountKey(tenantID: string, siteID: string, today: number) {
  return `stats:${tenantID}:${siteID}:dailyCommentCount:${today}`;
}

function hourlyCommentCountKey(tenantID: string, siteID: string, hour: number) {
  return `stats:${tenantID}:${siteID}:hourlyCommentCount:${hour}`;
}

function dailyStaffCommentCountKey(
  tenantID: string,
  siteID: string,
  today: number
) {
  return `stats:${tenantID}:${siteID}:dailyStaffCommentCount:${today}`;
}

function hourlyStaffCommentCountKey(
  tenantID: string,
  siteID: string,
  hour: number
) {
  return `stats:${tenantID}:${siteID}:hourlyStaffCommentCount:${hour}`;
}

export async function updateCommentTotals(
  redis: Redis,
  tenantID: string,
  siteID: string,
  now: Date
) {
  await updateHourlyCount(redis, tenantID, siteID, now, hourlyCommentCountKey);
  await updateDailyCount(redis, tenantID, siteID, now, dailyCommentCountKey);
}

export async function updateStaffCommentTotals(
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
    await updateHourlyCount(
      redis,
      tenantID,
      siteID,
      now,
      hourlyStaffCommentCountKey
    );
    await updateDailyCount(
      redis,
      tenantID,
      siteID,
      now,
      dailyStaffCommentCountKey
    );
  }
  return;
}

export async function retrieveDailyCommentTotal(
  redis: Redis,
  tenantID: string,
  siteID: string,
  now: Date
) {
  return retrieveDailyTotal(redis, tenantID, siteID, now, dailyCommentCountKey);
}

export async function retrieveDailyStaffCommentTotal(
  redis: Redis,
  tenantID: string,
  siteID: string,
  now: Date
) {
  return retrieveDailyTotal(
    redis,
    tenantID,
    siteID,
    now,
    dailyStaffCommentCountKey
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
