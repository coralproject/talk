import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { DURATION_UNIT } from "coral-framework/components";
import { TableCell, TableRow } from "coral-ui/components";

import styles from "./AccountHistoryRecord.css";

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
          id="moderate-user-drawer-suspension-seconds"
          $value={currentValue.toString()}
        >
          seconds
        </Localized>
      );
    }
    return (
      <Localized
        id="moderate-user-drawer-suspension-second"
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
          id="moderate-user-drawer-suspension-minutes"
          $value={currentValue.toString()}
        >
          minutes
        </Localized>
      );
    }

    return (
      <Localized
        id="moderate-user-drawer-suspension-minute"
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
          id="moderate-user-drawer-suspension-hours"
          $value={currentValue.toString()}
        >
          hours
        </Localized>
      );
    }

    return (
      <Localized
        id="moderate-user-drawer-suspension-hour"
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
          id="moderate-user-drawer-suspension-days"
          $value={currentValue.toString()}
        >
          days
        </Localized>
      );
    }

    return (
      <Localized
        id="moderate-user-drawer-suspension-day"
        $value={currentValue.toString()}
      >
        day
      </Localized>
    );
  },
  [DURATION_UNIT.WEEKS]: currentValue => {
    if (currentValue > 1) {
      return (
        <Localized
          id="moderate-user-drawer-suspension-weeks"
          $value={currentValue.toString()}
        >
          weeks
        </Localized>
      );
    }

    return (
      <Localized
        id="moderate-user-drawer-suspension-week"
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
  let action: React.ReactNode = null;
  if (active) {
    const startDate = new Date(from.start);
    const endDate = new Date(from.finish);
    const diffSeconds = (endDate.getTime() - startDate.getTime()) / 1000;

    const unit = unitTypes.reduce((x, cur) =>
      diffSeconds % cur === 0 && diffSeconds !== 0 ? cur : x
    );
    const value = diffSeconds / unit;
    const timeSpan = unitElements[unit](value);

    action = <>{timeSpan}</>;
  } else {
    action = (
      <Localized id={"moderate-user-drawer-account-history-suspension-removed"}>
        Suspension Removed
      </Localized>
    );
  }

  return (
    <TableRow className={styles.row}>
      <TableCell className={styles.date}>
        {createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </TableCell>
      <TableCell className={styles.action}>{action}</TableCell>
      <TableCell className={styles.user}>{createdBy}</TableCell>
    </TableRow>
  );
};

export default SuspensionRecord;
