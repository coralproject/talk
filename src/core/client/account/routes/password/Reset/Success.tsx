import { Localized } from "@fluent/react/compat";
import React from "react";

import styles from "./Reset.css";

const Success: React.FunctionComponent = () => {
  return (
    <div>
      <Localized id="resetPassword-successfullyReset">
        <div className={styles.title}>Password successfully reset</div>
      </Localized>
      <Localized id="resetPassword-youMayClose">
        <div className={styles.description}>
          You may now close this window and sign in to your account with your
          new password.
        </div>
      </Localized>
    </div>
  );
};

export default Success;
