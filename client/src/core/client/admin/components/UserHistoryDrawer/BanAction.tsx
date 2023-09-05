import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

export interface BanActionProps {
  action: "created" | "removed";
}

const BanAction: FunctionComponent<BanActionProps> = ({ action }) =>
  action === "created" ? (
    <Localized id="moderate-user-drawer-account-history-banned">
      <span>Banned</span>
    </Localized>
  ) : (
    <Localized id="moderate-user-drawer-account-history-ban-removed">
      <span>Ban removed</span>
    </Localized>
  );

export default BanAction;
