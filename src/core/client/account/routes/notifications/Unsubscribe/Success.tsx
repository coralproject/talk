import { Localized } from "@fluent/react/compat";
import React from "react";

import styles from "./Unsubscribe.css";

const Success: React.FunctionComponent = () => {
  return (
    <div data-testid="success">
      <Localized id="unsubscribe-unsubscribedSuccessfully">
        <div className={styles.title}>
          Unsubscribed successfully from email notifications
        </div>
      </Localized>
      <Localized id="unsubscribe-youMayNowClose">
        <div className={styles.description}>You may now close this window</div>
      </Localized>
    </div>
  );
};

export default Success;
