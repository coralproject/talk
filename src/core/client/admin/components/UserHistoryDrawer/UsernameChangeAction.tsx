import { Localized } from "fluent-react/compat";
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
      <Localized id="moderate-user-drawer-usernameChange">
        <div>Username change</div>
      </Localized>
      <div>
        <Localized id="moderate-user-drawer-usernameChangeNew">
          <span className={styles.tableLight}>New: </span>
        </Localized>
        {username}
      </div>
      {prevUsername && (
        <div>
          <Localized id="moderate-user-drawer-usernameChangeOld">
            <span className={styles.tableLight}>Old: </span>
          </Localized>
          <div>{prevUsername}</div>
        </div>
      )}
    </div>
  );
};

export default SuspensionAction;
