import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import styles from "./UsernameChangeAction.css";

export interface UsernameChangeActionProps {
  username: string;
  prevUsername: string | null;
}

const SuspensionAction: FunctionComponent<UsernameChangeActionProps> = ({
  username,
  prevUsername,
}) => {
  return (
    <div className={styles.usernameCell}>
      <Localized id="moderate-user-drawer-username-change">
        <div>Username change</div>
      </Localized>
      <div>
        <Localized id="moderate-user-drawer-username-change-new">
          <span className={styles.tableLight}>New: </span>
        </Localized>{" "}
        {username}
      </div>
      {prevUsername && (
        <div>
          <Localized id="moderate-user-drawer-username-change-old">
            <span className={styles.tableLight}>Old: </span>
          </Localized>{" "}
          {prevUsername}
        </div>
      )}
    </div>
  );
};

export default SuspensionAction;
