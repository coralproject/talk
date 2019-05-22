import React, { FunctionComponent } from "react";

import { Icon } from "coral-ui/components";

import styles from "./RejectedIcon.css";

const RejectedIcon: FunctionComponent = () => (
  <Icon className={styles.root}>cancel</Icon>
);

export default RejectedIcon;
