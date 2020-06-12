import { Localized } from "@fluent/react/compat";
import React from "react";

import styles from "./Confirm.css";

const Success: React.FunctionComponent = () => {
  return (
    <div>
      <Localized id="confirmEmail-successfullyConfirmed">
        <div className={styles.title}>Email successfully confirmed</div>
      </Localized>
      <Localized id="confirmEmail-youMayClose">
        <div className={styles.description}>You may now close this window.</div>
      </Localized>
    </div>
  );
};

export default Success;
