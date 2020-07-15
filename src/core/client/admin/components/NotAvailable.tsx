import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import styles from "./NotAvailable.css";

// TODO: (cvle) remove color styles from here. Color should be applied externally.

const NotAvailable: FunctionComponent = (props) => (
  <Localized id="general-notAvailable">
    <span className={styles.root}>Not available</span>
  </Localized>
);

export default NotAvailable;
