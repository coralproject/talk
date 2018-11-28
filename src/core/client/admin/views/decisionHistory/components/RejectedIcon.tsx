import React, { StatelessComponent } from "react";

import { Icon } from "talk-ui/components";

import styles from "./RejectedIcon.css";

const RejectedIcon: StatelessComponent = () => (
  <Icon className={styles.root}>cancel</Icon>
);

export default RejectedIcon;
