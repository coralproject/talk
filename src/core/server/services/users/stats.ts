import { Tenant } from "coral-server/models/tenant";
import {
  CachedDbCount,
  CachedHourlyCount,
} from "coral-server/services/stats/helpers";

import { countUsersByBanStatus } from "coral-server/models/user";

import { Db } from "mongodb";
import { AugmentedRedis } from "../redis";

function hourlySignupsPrefix(tenantID: string) {
  return `stats:${tenantID}:signups`;
}

function hourlyBansPrefix(tenantID: string) {
  return `stats:${tenantID}:bans`;
}

function allTimeBansKey(tenantID: string) {
  return `stats:${tenantID}:allTimeBans`;
}

function allTimeUsersKey(tenantID: string) {
  return `stats:${tenantID}:allTimeUsers`;
}

export function incrementSignupsToday(
  redis: AugmentedRedis,
  tenantID: string,
  now: Date
) {
  const counter = new CachedHourlyCount(redis, hourlySignupsPrefix(tenantID));
  return counter.increment(now);
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
  const counter = new CachedHourlyCount(redis, hourlySignupsPrefix(tenant.id));
  return counter.retrieveDailyTotal(zone, now);
}

export async function incrementBansCount(
  redis: AugmentedRedis,
  tenantID: string,
  now: Date
) {
  const hourlyCounter = new CachedHourlyCount(
    redis,
    hourlyBansPrefix(tenantID)
  );
  const allTimeCounter = new CachedDbCount(redis, [allTimeBansKey(tenantID)]);
  await hourlyCounter.increment(now);
  return allTimeCounter.increment();
}

export function retrieveBansToday(
  redis: AugmentedRedis,
  tenantID: string,
  zone: string,
  now: Date
) {
  const hourlyCounter = new CachedHourlyCount(
    redis,
    hourlyBansPrefix(tenantID)
  );
  return hourlyCounter.retrieveDailyTotal(zone, now);
}

export async function retrieveBanStatusCount(
  mongo: Db,
  redis: AugmentedRedis,
  tenantID: string
) {
  const countKey = allTimeUsersKey(tenantID);
  const bannedCountKey = allTimeBansKey(tenantID);

  const allTimeUsersCounter = new CachedDbCount(redis, [
    countKey,
    bannedCountKey,
  ]);

  const [all, banned] = await allTimeUsersCounter.retrieveTotal(async () => {
    const counts = await countUsersByBanStatus(mongo, tenantID);
    return [counts.all, counts.banned];
  });
  return { all, banned };
}

export function retrieveSignupsForWeek(
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
  const counter = new CachedHourlyCount(redis, hourlySignupsPrefix(tenant.id));
  return counter.retrieveDailyTotals(zone, now);
}
