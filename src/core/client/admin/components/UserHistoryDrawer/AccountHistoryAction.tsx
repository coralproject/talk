import React, { FunctionComponent } from "react";

import BanAction, { BanActionProps } from "./BanAction";
import PremodAction, { PremodActionProps } from "./PremodAction";
import SuspensionAction, { SuspensionActionProps } from "./SuspensionAction";
import UsernameChangeAction, {
  UsernameChangeActionProps,
} from "./UsernameChangeAction";
import WarningAction, { WarningActionProps } from "./WarningAction";

export interface HistoryActionProps {
  kind: "username" | "suspension" | "ban" | "premod" | "warning";
  action:
    | UsernameChangeActionProps
    | SuspensionActionProps
    | BanActionProps
    | PremodActionProps
    | WarningActionProps;
}

const AccountHistoryAction: FunctionComponent<HistoryActionProps> = ({
  kind,
  action,
}) => {
  switch (kind) {
    case "username":
      return (
        <UsernameChangeAction {...(action as UsernameChangeActionProps)} />
      );
    case "suspension":
      return <SuspensionAction {...(action as SuspensionActionProps)} />;
    case "ban":
      return <BanAction {...(action as BanActionProps)} />;
    case "premod":
      return <PremodAction {...(action as PremodActionProps)} />;
    case "warning":
      return <WarningAction {...(action as WarningActionProps)} />;
    default:
      return null;
  }
};

export default AccountHistoryAction;
