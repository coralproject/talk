import React, { FunctionComponent } from "react";

import { CallOut } from "coral-ui/components/v3";

import styles from "./CSSLoadError.css";

interface CSSLoadErrorProps {
  children?: React.ReactNode;
}

const CSSLoadError: FunctionComponent<CSSLoadErrorProps> = (props) => (
  <CallOut color="error" className={styles.root}>
    {props.children}
  </CallOut>
);

export default CSSLoadError;
