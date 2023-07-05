import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

export interface WarningActionProps {
  action: "created" | "removed" | "acknowledged";
  acknowledgedAt: Date | null;
}

import { useDateTimeFormatter } from "coral-framework/hooks";

const WarningAction: FunctionComponent<WarningActionProps> = ({
  action,
  acknowledgedAt,
}) => {
  const formatter = useDateTimeFormatter({
    hour: "numeric",
    minute: "2-digit",
  });
  if (action === "created") {
    return (
      <Localized id="moderate-user-drawer-account-history-warning-set">
        <span>User warned</span>
      </Localized>
    );
  } else if (action === "removed") {
    return (
      <Localized id="moderate-user-drawer-account-history-warning-removed">
        <span>Warning removed</span>
      </Localized>
    );
  } else if (action === "acknowledged") {
    return (
      <Localized id="moderate-user-drawer-account-history-warning-acknowledged">
        <span>
          Warning acknowledged at{" "}
          {acknowledgedAt ? formatter(acknowledgedAt) : ""}
        </span>
      </Localized>
    );
  }
  return null;
};
export default WarningAction;
