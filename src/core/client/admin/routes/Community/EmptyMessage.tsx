import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import styles from "./EmptyMessage.css";

const EmptyMessage: FunctionComponent = (props) => (
  <Localized id="community-emptyMessage">
    <div className={styles.root}>
      We could not find anyone in your community matching your criteria.
    </div>
  </Localized>
);

export default EmptyMessage;
