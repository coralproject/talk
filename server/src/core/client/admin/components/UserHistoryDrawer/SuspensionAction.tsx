import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { reduceSeconds } from "coral-common/helpers/i18n";

interface From {
  start: Date;
  finish: Date;
}

export interface SuspensionActionProps {
  action: "created" | "removed" | "ended";
  from: From;
}

const SuspensionAction: FunctionComponent<SuspensionActionProps> = ({
  action,
  from,
}) => {
  if (action === "created") {
    const seconds = (from.finish.getTime() - from.start.getTime()) / 1000;
    const { scaled, unit } = reduceSeconds(seconds);

    return (
      <Localized
        id="moderate-user-drawer-suspension"
        vars={{ unit, value: scaled }}
      >
        <span>
          Suspension, {scaled} {unit}
        </span>
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
