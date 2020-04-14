import { Redis } from "ioredis";
import { DateTime } from "luxon";

export function updateDailyCount(
  redis: Redis,
  tenantID: string,
  now: Date,
  keyGenerator: (tenantID: string, offset: number) => string
) {
  const today = DateTime.fromJSDate(now)
    .startOf("day")
    .toSeconds();

  const expireDaily = DateTime.fromJSDate(now)
    .endOf("day")
    .toSeconds();
  const dailyKey = keyGenerator(tenantID, today);
  return redis
    .multi()
    .incr(dailyKey)
    .expireat(dailyKey, expireDaily)
    .exec();
}

export function updateHourlyCount(
  redis: Redis,
  tenantID: string,
  now: Date,
  keyGenerator: (tenantID: string, offset: number) => string
) {
  const hour = DateTime.fromJSDate(now).startOf("hour").hour;
  const expireHourly = DateTime.fromJSDate(now)
    .startOf("hour")
    .plus({ days: 1 })
    .toSeconds();

  const hourlyKey = keyGenerator(tenantID, hour);
  return redis
    .multi()
    .incr(hourlyKey)
    .expireat(hourlyKey, expireHourly)
    .exec();
}

export async function retrieveDailyTotal(
  redis: Redis,
  tenantID: string,
  now: Date,
  keyGenerator: (tenantID: string, offset: number) => string
) {
  const today = DateTime.fromJSDate(now)
    .startOf("day")
    .toSeconds();
  const key = keyGenerator(tenantID, today);
  const value = await redis.get(key);
  return value ? parseInt(value, 10) : 0;
}

export async function retrieveHourlyTotals(
  redis: Redis,
  tenantID: string,
  now: Date,
  keyGenerator: (tenantID: string, offset: number) => string
) {
  const firstHour = DateTime.fromJSDate(now)
    .startOf("hour")
    .minus({ hours: 23 });
  const keys = [];
  for (let i = 0; i < 24; i++) {
    const hour = firstHour.plus({ hours: i }).hour;
    keys[i] = keyGenerator(tenantID, hour);
  }
  const values = await redis.mget(...keys);

  const output: { [timestamp: string]: number | null } = {};
  for (let i = 0; i < values.length; i++) {
    const timestamp = firstHour.plus({ hours: i }).toISO();
    output[timestamp] = values[i] ? parseInt(values[i], 10) : 0;
  }
  return output;
}
