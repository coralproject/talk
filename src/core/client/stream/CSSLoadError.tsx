import React, { FunctionComponent } from "react";

import { CallOut } from "coral-ui/components/v3";

import styles from "./CSSLoadError.css";

const CSSLoadError: FunctionComponent = (props) => (
  <CallOut color="error" className={styles.root}>
    {props.children}
  </CallOut>
);

export default CSSLoadError;
