import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

export interface PremodActionProps {
  action: "created" | "removed";
}

const PremodAction: FunctionComponent<PremodActionProps> = ({ action }) =>
  action === "created" ? (
    <Localized id="moderate-user-drawer-account-history-premod-set">
      <span>Set always premoderate</span>
    </Localized>
  ) : (
    <Localized id="moderate-user-drawer-account-history-premod-removed">
      <span>Removed always premoderate</span>
    </Localized>
  );

export default PremodAction;
