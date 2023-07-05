import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { Message } from "coral-ui/components/v2";

import styles from "./NetworkError.css";

const NetworkError: FunctionComponent<{}> = () => {
  return (
    <div className={styles.root}>
      <Message color="error">
        <Localized id="authcheck-network-error">
          <span>A network error occurred. Please refresh the page</span>
        </Localized>
      </Message>
    </div>
  );
};

export default NetworkError;
