import React, { FunctionComponent } from "react";

import { HorizontalGutter } from "coral-ui/components/v2";

import styles from "./NotFound.css";

const NotFound: FunctionComponent = () => (
  <HorizontalGutter>
    <div className={styles.root}>Not Found</div>
  </HorizontalGutter>
);

export default NotFound;
