import React, { FunctionComponent } from "react";

import { Icon } from "coral-ui/components/v2";

import styles from "./RejectedIcon.css";

const RejectedIcon: FunctionComponent = () => (
  <Icon size="md" className={styles.root}>
    cancel
  </Icon>
);

export default RejectedIcon;
