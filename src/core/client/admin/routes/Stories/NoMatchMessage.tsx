import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import styles from "./NoMatchMessage.css";

const NoMatchMessage: FunctionComponent = (props) => (
  <Localized id="stories-noMatchMessage">
    <div className={styles.root}>
      We could not find any stories matching your criteria.
    </div>
  </Localized>
);

export default NoMatchMessage;
