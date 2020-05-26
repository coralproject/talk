import React, { FunctionComponent } from "react";

import { HorizontalGutter } from "coral-ui/components/v2";

import styles from "./NotFound.css";

const NotFound: FunctionComponent = () => (
  <HorizontalGutter container="main">
    <div className={styles.content}>Not Found</div>
  </HorizontalGutter>
);

export default NotFound;
