import React, { FunctionComponent } from "react";

import { Icon } from "talk-ui/components";

import styles from "./RejectedIcon.css";

const RejectedIcon: FunctionComponent = () => (
  <Icon className={styles.root}>cancel</Icon>
);

export default RejectedIcon;
