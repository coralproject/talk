import { Tenant } from "coral-server/models/tenant";
import {
  incrementHourlyCount,
  retrieveDailyTotal,
} from "coral-server/services/stats/helpers";

import { AugmentedRedis } from "../redis";

function hourlySignupsKey(tenantID: string, siteID: string, hour: number) {
  return `stats:${tenantID}:hourlySignups:${hour}`;
}

function hourlyBansKey(tenantID: string, siteID: string, day: number) {
  return `hourlyBans:${tenantID}:${day}`;
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
