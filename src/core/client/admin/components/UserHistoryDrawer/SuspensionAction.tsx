import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { DURATION_UNIT } from "coral-framework/components";

interface From {
  start: Date;
  finish: Date;
}

export interface SuspensionActionProps {
  action: "created" | "removed" | "ended";
  from: From;
}

const UNITS = [
  DURATION_UNIT.WEEKS,
  DURATION_UNIT.DAYS,
  DURATION_UNIT.HOURS,
  DURATION_UNIT.MINUTES,
  DURATION_UNIT.SECONDS,
];

const UNIT_MAP = {
  [DURATION_UNIT.SECONDS]: "second",
  [DURATION_UNIT.MINUTES]: "minute",
  [DURATION_UNIT.HOURS]: "hour",
  [DURATION_UNIT.DAYS]: "day",
  [DURATION_UNIT.WEEKS]: "week",
};

function reduceValue(value: number) {
  // Find the largest match for the smallest number.
  const unit: keyof typeof UNIT_MAP =
    UNITS.find(compare => value >= compare) || DURATION_UNIT.SECONDS;

  return {
    value: Math.round((value / unit) * 100) / 100,
    unit: UNIT_MAP[unit],
  };
}

const SuspensionAction: FunctionComponent<SuspensionActionProps> = ({
  action,
  from,
}) => {
  if (action === "created") {
    const seconds = (from.finish.getTime() - from.start.getTime()) / 1000;
    const { value, unit } = reduceValue(seconds);

    return (
      <Localized
        id="moderate-user-drawer-suspension"
        $unit={unit}
        $value={value}
      >
        <span>Suspension, {seconds} seconds</span>
      </Localized>
    );
  } else if (action === "removed") {
    return (
      <Localized id="moderate-user-drawer-account-history-suspension-removed">
        <span>Suspension removed</span>
      </Localized>
    );
  }

  return (
    <Localized id="moderate-user-drawer-account-history-suspension-ended">
      <span>Suspension ended</span>
    </Localized>
  );
};

export default SuspensionAction;
