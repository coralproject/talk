import TIME from "coral-common/time";

export const UNIT_MAP = {
  [TIME.SECOND]: "second",
  [TIME.MINUTE]: "minute",
  [TIME.HOUR]: "hour",
  [TIME.DAY]: "day",
  [TIME.WEEK]: "week",
};

export const DEFAULT_UNITS = [
  TIME.WEEK,
  TIME.DAY,
  TIME.HOUR,
  TIME.MINUTE,
  TIME.SECOND,
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
  units: TIME[] = DEFAULT_UNITS
): ScaledUnit {
  // Find the largest match for the smallest number.
  const unit: keyof typeof UNIT_MAP =
    units.find((compare) => value >= compare) || TIME.SECOND;

  // Scale the value to the unit.
  const scaled = Math.round((value / unit) * 100) / 100;

  return {
    original: value,
    value: value.toString(),
    scaled,
    unit: UNIT_MAP[unit],
  };
}
