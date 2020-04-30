import { Redis } from "ioredis";
import { isNull } from "lodash";
import { DateTime } from "luxon";

function hourlyKey(prefix: string, day: number, hour: number) {
  return `${prefix}:hourlyCount:${day}:${hour}`;
}

export class CachedHourlyCount {
  private redis: Redis;
  private prefix: string;
  constructor(redis: Redis, keyPrefix: string) {
    this.redis = redis;
    this.prefix = keyPrefix;
  }

  public increment(now: Date) {
    const hour = DateTime.fromJSDate(now).startOf("hour").toUTC();
    const expireHourly = DateTime.fromJSDate(now)
      .startOf("hour")
      .plus({ days: 1 })
      .toSeconds();

    const key = hourlyKey(this.prefix, hour.ordinal, hour.hour);
    return this.redis.multi().incr(key).expireat(key, expireHourly).exec();
  }

  public async retrieveDailyTotal(zone: string, now: Date) {
    const startOfDay = DateTime.fromJSDate(now)
      .setZone(zone)
      .startOf("day")
      .toUTC();
    const keys = [];
    for (let i = 0; i < 24; i++) {
      const hour = startOfDay.plus({ hours: i });
      keys[i] = hourlyKey(this.prefix, hour.ordinal, hour.hour);
    }
    const values = await this.redis.mget(...keys);
    return values.reduce(
      (acc, value) => acc + (isNull(value) ? 0 : parseInt(value, 10)),
      0
    );
  }

  public async retrieveHourlyTotals(now: Date) {
    const firstHour = DateTime.fromJSDate(now)
      .startOf("hour")
      .minus({ hours: 23 });
    const keys = [];
    for (let i = 0; i < 24; i++) {
      const hour = firstHour.toUTC().plus({ hours: i });
      keys[i] = hourlyKey(this.prefix, hour.ordinal, hour.hour);
    }
    const values = await this.redis.mget(...keys);

    const hours = [];
    for (let i = 0; i < values.length; i++) {
      const timestamp = firstHour.plus({ hours: i }).toString();
      const value = values[i];
      hours.push({
        timestamp,
        count: isNull(value) ? 0 : parseInt(value, 10),
      });
    }
    return hours;
  }

  public async retrieveDailyTotals(zone: string, now: Date) {
    const sevenDaysAgo = DateTime.fromJSDate(now)
      .setZone(zone)
      .startOf("day")
      .minus({ days: 7 });

    const keys = [];
    for (let i = 0; i < 7 * 24; i++) {
      const hour = sevenDaysAgo.plus({ hours: i }).toUTC();
      keys[i] = hourlyKey(this.prefix, hour.ordinal, hour.hour);
    }

    const values = await this.redis.mget(...keys);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const timestamp = sevenDaysAgo.plus({ days: i }).toString();
      days[i] = {
        timestamp,
        count: values
          .slice(i * 24, i * 24 + 24)
          .reduce(
            (acc, value) => acc + (isNull(value) ? 0 : parseInt(value, 10)),
            0
          ),
      };
    }
    return days;
  }
}
