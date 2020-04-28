import { Tenant } from "coral-server/models/tenant";
import {
  incrementHourlyCount,
  retrieveDailyTotal,
} from "coral-server/services/stats/helpers";

import { countUsersByBanStatus } from "coral-server/models/user";

import { Db } from "mongodb";
import { AugmentedRedis } from "../redis";

function hourlySignupsKey(tenantID: string, siteID: string, hour: number) {
  return `stats:${tenantID}:hourlySignups:${hour}`;
}

function hourlyBansKey(tenantID: string, siteID: string, day: number) {
  return `hourlyBans:${tenantID}:${day}`;
}

function allTimeBansKey(tenantID: string, siteID: string) {
  return `stats:${tenantID}:${siteID}:allTimeBans`;
}

function allTimeUsersKey(tenantID: string, siteID: string) {
  return `stats:${tenantID}:${siteID}:allTimeUsers`;
}

export function incrementSignupsToday(
  redis: AugmentedRedis,
  tenantID: string,
  now: Date
) {
  return incrementHourlyCount(redis, tenantID, null, now, hourlySignupsKey);
}

export function retrieveSignupsToday(
  redis: AugmentedRedis,
  tenant: Tenant,
  zone: string,
  now: Date
) {
  if (
    tenant.auth.integrations.sso.enabled &&
    tenant.auth.integrations.sso.allowRegistration
  ) {
    throw new Error("can't count users");
  }
  return retrieveDailyTotal(
    redis,
    tenant.id,
    null,
    zone,
    now,
    hourlySignupsKey
  );
}

export function incrementBansToday(
  redis: AugmentedRedis,
  tenantID: string,
  now: Date
) {
  return incrementHourlyCount(redis, tenantID, null, now, hourlyBansKey);
}

export function retrieveBansToday(
  redis: AugmentedRedis,
  tenantID: string,
  zone: string,
  now: Date
) {
  return retrieveDailyTotal(redis, tenantID, null, zone, now, hourlyBansKey);
}

export async function incrementBansCount(
  redis: AugmentedRedis,
  tenantID: string,
  siteID: string
) {
  const countKey = allTimeBansKey(tenantID, siteID);

  return redis.incr(countKey);
}

export async function retrieveBanStatusCount(
  mongo: Db,
  redis: AugmentedRedis,
  tenantID: string,
  siteID: string
) {
  const countKey = allTimeUsersKey(tenantID, siteID);
  const bannedCountKey = allTimeBansKey(tenantID, siteID);
  const [cachedCount, cachedBannedCount] = await redis.mget(
    countKey,
    bannedCountKey
  );
  if (cachedCount && cachedBannedCount) {
    return {
      all: parseInt(cachedCount, 10),
      banned: parseInt(cachedBannedCount, 10),
    };
  }
  const expiry = 3 * 3600;

  const { all, banned } = await countUsersByBanStatus(mongo, tenantID);

  await redis
    .multi()
    .set(countKey, all)
    .set(bannedCountKey, banned)
    .expireat(countKey, expiry)
    .expireat(bannedCountKey, expiry)
    .exec();
  return { all, banned };
}
