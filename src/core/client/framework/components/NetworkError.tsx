import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import styles from "./NetworkError.css";

const NetworkError: FunctionComponent = () => {
  return (
    <div className={styles.root}>
      <Localized id="common-networkError">
        <div>Network error. Please refresh your page and try again.</div>
      </Localized>
    </div>
  );
};

export default NetworkError;
