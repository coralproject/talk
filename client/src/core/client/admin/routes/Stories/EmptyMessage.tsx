import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import styles from "./EmptyMessage.css";

const EmptyMessage: FunctionComponent = (props) => (
  <Localized id="stories-emptyMessage">
    <div className={styles.root}>There are currently no published stories.</div>
  </Localized>
);

export default EmptyMessage;
