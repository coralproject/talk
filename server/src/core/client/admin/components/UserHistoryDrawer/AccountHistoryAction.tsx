import React, { FunctionComponent } from "react";

import BanAction, { BanActionProps } from "./BanAction";
import ModMessageAction, { ModMessageActionProps } from "./ModMessageAction";
import PremodAction, { PremodActionProps } from "./PremodAction";
import SiteBanAction from "./SiteBanAction";
import SuspensionAction, { SuspensionActionProps } from "./SuspensionAction";
import UsernameChangeAction, {
  UsernameChangeActionProps,
} from "./UsernameChangeAction";
import WarningAction, { WarningActionProps } from "./WarningAction";

export interface HistoryActionProps {
  kind:
    | "username"
    | "suspension"
    | "ban"
    | "site-ban"
    | "premod"
    | "warning"
    | "modMessage";
  action:
    | UsernameChangeActionProps
    | SuspensionActionProps
    | BanActionProps
    | PremodActionProps
    | WarningActionProps
    | ModMessageActionProps;
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
    case "site-ban":
      return <SiteBanAction {...(action as BanActionProps)} />;
    case "premod":
      return <PremodAction {...(action as PremodActionProps)} />;
    case "warning":
      return <WarningAction {...(action as WarningActionProps)} />;
    case "modMessage":
      return <ModMessageAction {...(action as ModMessageActionProps)} />;
    default:
      return null;
  }
};

export default AccountHistoryAction;
