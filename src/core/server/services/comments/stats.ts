import { Redis } from "ioredis";

import { User } from "coral-server/models/user";
import {
  retrieveDailyTotal,
  retrieveHourlyTotals,
  updateHourlyCount,
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

export function updateCommentTotals(
  redis: Redis,
  tenantID: string,
  siteID: string,
  now: Date
) {
  return updateHourlyCount(redis, tenantID, siteID, now, hourlyCommentCountKey);
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
    return updateHourlyCount(
      redis,
      tenantID,
      siteID,
      now,
      hourlyStaffCommentCountKey
    );
  }
  return;
}

export async function updateRejectionTotal(
  redis: Redis,
  tenantID: string,
  siteID: string,
  now: Date
) {
  return updateHourlyCount(
    redis,
    tenantID,
    siteID,
    now,
    hourlyCommentsRejectedKey
  );
}

export async function retrieveDailyCommentTotal(
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

export async function retrieveDailyRejectionTotal(
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

export async function retrieveDailyStaffCommentTotal(
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
