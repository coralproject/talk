import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { DURATION_UNIT } from "coral-framework/components";
import { TableCell, TableRow } from "coral-ui/components";

interface From {
  start: any;
  finish: any;
}

interface Props {
  createdAt: Date;
  createdBy: string | null | undefined;
  active: boolean;
  from: From;
}

const unitTypes = [
  DURATION_UNIT.SECONDS,
  DURATION_UNIT.MINUTES,
  DURATION_UNIT.HOURS,
  DURATION_UNIT.DAYS,
  DURATION_UNIT.WEEKS,
];

const unitElements: Record<
  DURATION_UNIT,
  (value: number) => React.ReactElement<any>
> = {
  [DURATION_UNIT.SECONDS]: currentValue => {
    if (currentValue > 1) {
      return (
        <Localized
          id="moderate-user-drawer-seconds"
          $value={currentValue.toString()}
        >
          seconds
        </Localized>
      );
    }
    return (
      <Localized
        id="moderate-user-drawer-second"
        $value={currentValue.toString()}
      >
        second
      </Localized>
    );
  },
  [DURATION_UNIT.MINUTES]: currentValue => {
    if (currentValue > 1) {
      return (
        <Localized
          id="moderate-user-drawer-minutes"
          $value={currentValue.toString()}
        >
          minutes
        </Localized>
      );
    }

    return (
      <Localized
        id="moderate-user-drawer-minute"
        $value={currentValue.toString()}
      >
        minute
      </Localized>
    );
  },
  [DURATION_UNIT.HOURS]: currentValue => {
    if (currentValue > 1) {
      return (
        <Localized
          id="moderate-user-drawer-hours"
          $value={currentValue.toString()}
        >
          hours
        </Localized>
      );
    }

    return (
      <Localized
        id="moderate-user-drawer-hour"
        $value={currentValue.toString()}
      >
        hour
      </Localized>
    );
  },
  [DURATION_UNIT.DAYS]: currentValue => {
    if (currentValue > 1) {
      return (
        <Localized
          id="moderate-user-drawer-days"
          $value={currentValue.toString()}
        >
          days
        </Localized>
      );
    }

    return (
      <Localized id="moderate-user-drawer-day" $value={currentValue.toString()}>
        day
      </Localized>
    );
  },
  [DURATION_UNIT.WEEKS]: currentValue => {
    if (currentValue > 1) {
      return (
        <Localized
          id="moderate-user-drawer-weeks"
          $value={currentValue.toString()}
        >
          weeks
        </Localized>
      );
    }

    return (
      <Localized
        id="moderate-user-drawer-week"
        $value={currentValue.toString()}
      >
        week
      </Localized>
    );
  },
};

const SuspensionRecord: FunctionComponent<Props> = ({
  createdAt,
  active,
  from,
  createdBy,
}) => {
  let action: any = null;
  if (active) {
    const startDate = new Date(from.start);
    const endDate = new Date(from.finish);
    const diffSeconds = (endDate.getTime() - startDate.getTime()) / 1000;

    const unit = unitTypes.reduce((x, cur) =>
      diffSeconds % cur === 0 && diffSeconds !== 0 ? cur : x
    );
    const value = diffSeconds / unit;
    const timeSpan = unitElements[unit](value);

    action = (
      <>
        <Localized id={"moderate-user-drawer-account-history-suspension-time"}>
          Suspension
        </Localized>
        {timeSpan}
      </>
    );
  } else {
    action = (
      <Localized id={"moderate-user-drawer-account-history-suspension-removed"}>
        Suspension Removed
      </Localized>
    );
  }

  return (
    <TableRow>
      <TableCell>
        {createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </TableCell>
      <TableCell>{action}</TableCell>
      <TableCell>{createdBy}</TableCell>
    </TableRow>
  );
};

export default SuspensionRecord;
