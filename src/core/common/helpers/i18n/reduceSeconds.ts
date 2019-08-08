/**
 * UNIT are units that can be used in the
 * DurationField components.
 */
export enum UNIT {
  SECONDS = 1,
  MINUTES = 60,
  HOURS = 3600,
  DAYS = 86400,
  WEEKS = 604800,
}

export const UNIT_MAP = {
  [UNIT.SECONDS]: "second",
  [UNIT.MINUTES]: "minute",
  [UNIT.HOURS]: "hour",
  [UNIT.DAYS]: "day",
  [UNIT.WEEKS]: "week",
};

export const DEFAULT_UNITS = [
  UNIT.WEEKS,
  UNIT.DAYS,
  UNIT.HOURS,
  UNIT.MINUTES,
  UNIT.SECONDS,
];

type ValueOf<T> = T[keyof T];

export interface ScaledUnit {
  original: number;
  value: string;
  unit: ValueOf<typeof UNIT_MAP>;
  scaled: number;
}

export default function reduceSeconds(
  value: number,
  units: UNIT[] = DEFAULT_UNITS
): ScaledUnit {
  // Find the largest match for the smallest number.
  const unit: keyof typeof UNIT_MAP =
    units.find(compare => value >= compare) || UNIT.SECONDS;

  // Scale the value to the unit.
  const scaled = Math.round((value / unit) * 100) / 100;

  return {
    original: value,
    value: value.toString(),
    scaled,
    unit: UNIT_MAP[unit],
  };
}
