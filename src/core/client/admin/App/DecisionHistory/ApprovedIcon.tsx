import React, { FunctionComponent } from "react";

import { Icon } from "coral-ui/components";

import styles from "./ApprovedIcon.css";

const ApprovedIcon: FunctionComponent = () => (
  <Icon className={styles.root}>check</Icon>
);

export default ApprovedIcon;
