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
  await updateHourlyCount(redis, tenantID, now, hourlyCommentCountKey);
  await updateDailyCount(redis, tenantID, now, dailyCommentCountKey);
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
    await updateHourlyCount(redis, tenantID, now, hourlyStaffCommentCountKey);
    await updateDailyCount(redis, tenantID, now, dailyStaffCommentCountKey);
  }
  return;
}

export async function retrieveDailyCommentTotal(
  redis: Redis,
  tenantID: string,
  now: Date
) {
  return retrieveDailyTotal(redis, tenantID, now, dailyCommentCountKey);
}

export async function retrieveDailyStaffCommentTotal(
  redis: Redis,
  tenantID: string,
  now: Date
) {
  return retrieveDailyTotal(redis, tenantID, now, dailyStaffCommentCountKey);
}

export async function retrieveHourlyCommentTotal(
  redis: Redis,
  tenantID: string,
  now: Date
) {
  return retrieveHourlyTotals(redis, tenantID, now, hourlyCommentCountKey);
}

export async function retrieveHourlyStaffCommentTotal(
  redis: Redis,
  tenantID: string,
  now: Date
) {
  return retrieveHourlyTotals(redis, tenantID, now, hourlyStaffCommentCountKey);
}
