import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import styles from "./NotAvailable.css";

const NoTextContent: FunctionComponent = (props) => (
  <Localized id="general-noTextContent">
    <span className={styles.root}>No text content</span>
  </Localized>
);

export default NoTextContent;
