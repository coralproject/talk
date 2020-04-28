import { Redis } from "ioredis";
import { isNull } from "lodash";
import { DateTime } from "luxon";

export function incrementDailyCount(
  redis: Redis,
  tenantID: string,
  siteID: string | null,
  now: Date,
  keyGenerator: (
    tenantID: string,
    siteID: string | null,
    offset: number
  ) => string
) {
  const today = DateTime.fromJSDate(now).startOf("day").toSeconds();

  const expireDaily = DateTime.fromJSDate(now).endOf("day").toSeconds();
  const dailyKey = keyGenerator(tenantID, siteID, today);
  return redis.multi().incr(dailyKey).expireat(dailyKey, expireDaily).exec();
}

export function incrementHourlyCount(
  redis: Redis,
  tenantID: string,
  siteID: string | null,
  now: Date,
  keyGenerator: (
    tenantID: string,
    siteID: string | null,
    offset: number
  ) => string
) {
  const hour = DateTime.fromJSDate(now).startOf("hour").hour;
  const expireHourly = DateTime.fromJSDate(now)
    .startOf("hour")
    .plus({ days: 1 })
    .toSeconds();

  const hourlyKey = keyGenerator(tenantID, siteID, hour);
  return redis.multi().incr(hourlyKey).expireat(hourlyKey, expireHourly).exec();
}

export async function retrieveDailyTotal(
  redis: Redis,
  tenantID: string,
  siteID: string | null,
  zone: string,
  now: Date,
  keyGenerator: (
    tenantID: string,
    siteID: string | null,
    offset: number
  ) => string
) {
  const startOfDay = DateTime.fromJSDate(now).setZone(zone).startOf("day");
  const keys = [];
  for (let i = 0; i < 24; i++) {
    const hour = startOfDay.plus({ hours: i }).hour;
    keys[i] = keyGenerator(tenantID, siteID, hour);
  }
  const values = await redis.mget(...keys);
  return values.reduce(
    (acc, value) => (!isNull(value) ? acc + parseInt(value, 10) : acc),
    0
  );
}

export async function retrieveHourlyTotals(
  redis: Redis,
  tenantID: string,
  siteID: string | null,
  now: Date,
  keyGenerator: (
    tenantID: string,
    siteID: string | null,
    offset: number
  ) => string
) {
  const firstHour = DateTime.fromJSDate(now)
    .startOf("hour")
    .minus({ hours: 23 });
  const keys = [];
  for (let i = 0; i < 24; i++) {
    const hour = firstHour.plus({ hours: i }).hour;
    keys[i] = keyGenerator(tenantID, siteID, hour);
  }
  const values = await redis.mget(...keys);

  const output: { [timestamp: string]: number | null } = {};
  for (let i = 0; i < values.length; i++) {
    const timestamp = firstHour.plus({ hours: i }).toISO();
    output[timestamp] = !isNull(values[i]) ? parseInt(values[i]!, 10) : 0;
  }
  return output;
}
