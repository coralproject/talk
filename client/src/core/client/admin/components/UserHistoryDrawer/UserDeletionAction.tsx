import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

export interface UserDeletionActionProps {
  action: "CANCELED" | "REQUESTED" | "%future added value";
}

const UserDeletionAction: FunctionComponent<UserDeletionActionProps> = ({
  action,
}) => {
  if (action === "REQUESTED") {
    return (
      <Localized id="moderate-user-drawer-user-scheduled-deletion">
        <span>User scheduled for deletion</span>
      </Localized>
    );
  } else if (action === "CANCELED") {
    return (
      <Localized id="moderate-user-drawer-user-deletion-canceled">
        <span>User deletion request canceled</span>
      </Localized>
    );
  }
  return null;
};
export default UserDeletionAction;
