import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

export interface UserDeletionActionProps {
  action: "CANCELED" | "REQUESTED" | "COMPLETED" | "%future added value";
}

const UserDeletionAction: FunctionComponent<UserDeletionActionProps> = ({
  action,
}) => {
  if (action === "REQUESTED") {
    return (
      <Localized id="">
        <span>User scheduled for deletion</span>
      </Localized>
    );
  } else if (action === "CANCELED") {
    return (
      <Localized id="">
        <span>User deletion request canceled</span>
      </Localized>
    );
  } else if (action === "COMPLETED") {
    return (
      <Localized id="">
        <span>User deleted</span>
      </Localized>
    );
  }
  return null;
};
export default UserDeletionAction;
