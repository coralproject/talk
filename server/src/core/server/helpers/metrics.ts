import { DateTime } from "luxon";

export interface TimeRange {
  readonly start: DateTime;
  readonly end: DateTime;
  readonly hours: number;
}

export type TimeUnit = "day" | "hour";

const TIME_UNIT_FORMAT: Record<TimeUnit, { js: string; mongo: string }> = {
  day: { js: "yyyy-LL-dd", mongo: "%Y-%m-%d" },
  hour: { js: "yyyy-LL-dd HH:00", mongo: "%Y-%m-%d %H:00" },
};

const TIME_UNIT_HOURS: Record<TimeUnit, number> = {
  day: 24,
  hour: 1,
};

const TIME_UNIT_MAX: Record<TimeUnit, number> = {
  day: 7,
  hour: 24,
};

export function getTimeRange(
  unit: TimeUnit,
  zone: string,
  now: Date,
  interval = TIME_UNIT_MAX[unit]
): TimeRange {
  // Convert the date to the specified zone.
  const end = DateTime.fromJSDate(now).setZone(zone);

  return {
    start: end.startOf(unit).minus({ [unit]: interval - 1 }),
    end,
    hours: interval * TIME_UNIT_HOURS[unit],
  };
}

export function getMongoFormat(unit: TimeUnit): string {
  return TIME_UNIT_FORMAT[unit].mongo;
}

export interface Result {
  _id: string;
  count: number;
}

export interface Point {
  count: number;
  timestamp: string;
}

export function formatTimeRangeSeries(
  unit: TimeUnit,
  start: DateTime,
  results: Result[]
) {
  if (results.length > TIME_UNIT_MAX[unit]) {
    throw new Error(
      `invalid number of items, expected ${TIME_UNIT_MAX[unit]}, got ${results.length}`
    );
  }

  const series: Point[] = [];

  let date = start;
  for (let i = 0; i < TIME_UNIT_MAX[unit]; i++) {
    const search = date.toFormat(TIME_UNIT_FORMAT[unit].js);
    const result = results.find(({ _id }) => _id === search);

    // Add the result (or zero if it doesn't exist) to the series.
    series.push({
      count: result ? result.count : 0,
      timestamp: date.toJSDate().toISOString(),
    });

    // Increment the date by the specified unit.
    date = date.plus({ [unit]: 1 });
  }

  return series;
}

export function getCount<T extends Array<{ count: number }>>(results: T) {
  return results.length === 1 ? results[0].count : 0;
}
