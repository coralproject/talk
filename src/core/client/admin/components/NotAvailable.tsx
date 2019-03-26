import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import styles from "./NotAvailable.css";

const NotAvailable: StatelessComponent = props => (
  <Localized id="general-notAvailable">
    <span className={styles.root}>Not available</span>
  </Localized>
);

export default NotAvailable;
