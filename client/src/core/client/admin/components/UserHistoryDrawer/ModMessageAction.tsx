import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

export interface ModMessageActionProps {
  action: "created" | "acknowledged";
  acknowledgedAt: Date | null;
}

import { useDateTimeFormatter } from "coral-framework/hooks";

const ModMessageAction: FunctionComponent<ModMessageActionProps> = ({
  action,
  acknowledgedAt,
}) => {
  const formatter = useDateTimeFormatter({
    hour: "numeric",
    minute: "2-digit",
  });
  if (action === "created") {
    return (
      <Localized id="moderate-user-drawer-account-history-modMessage-sent">
        <span>User messaged</span>
      </Localized>
    );
  } else {
    return (
      <Localized
        id="moderate-user-drawer-account-history-modMessage-acknowledged"
        vars={{
          acknowledgedAt: acknowledgedAt ? formatter(acknowledgedAt) : "",
        }}
      >
        <span>
          Message acknowledged at{" "}
          {acknowledgedAt ? formatter(acknowledgedAt) : ""}
        </span>
      </Localized>
    );
  }
};
export default ModMessageAction;
