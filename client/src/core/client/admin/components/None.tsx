import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import styles from "./NotAvailable.css";

const None: FunctionComponent = (props) => (
  <Localized id="general-none">
    <span className={styles.root}>None</span>
  </Localized>
);

export default None;
