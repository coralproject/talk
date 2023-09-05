import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

export interface BanActionProps {
  action: "created" | "removed";
}

const SiteBanAction: FunctionComponent<BanActionProps> = ({ action }) =>
  action === "created" ? (
    <Localized id="moderate-user-drawer-account-history-site-banned">
      <span>Site banned</span>
    </Localized>
  ) : (
    <Localized id="moderate-user-drawer-account-history-site-ban-removed">
      <span>Site ban removed</span>
    </Localized>
  );

export default SiteBanAction;
