import React, { FunctionComponent } from "react";

import BanAction, { BanActionProps } from "./BanAction";
import SuspensionAction, { SuspensionActionProps } from "./SuspensionAction";
import UsernameChangeAction, {
  UsernameChangeActionProps,
} from "./UsernameChangeAction";

export interface HistoryActionProps {
  kind: "username" | "suspension" | "ban";
  action: UsernameChangeActionProps | SuspensionActionProps | BanActionProps;
}

const AccountHistoryAction: FunctionComponent<HistoryActionProps> = ({
  kind,
  action,
}) => {
  switch (kind) {
    case "username":
      return <UsernameChangeAction {...action as UsernameChangeActionProps} />;
    case "suspension":
      return <SuspensionAction {...action as SuspensionActionProps} />;
    case "ban":
      return <BanAction {...action as BanActionProps} />;
    default:
      return null;
  }
};

export default AccountHistoryAction;
