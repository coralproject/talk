import React, { FunctionComponent } from "react";

import { Icon } from "coral-ui/components/v2";

import styles from "./ApprovedIcon.css";

const ApprovedIcon: FunctionComponent = () => (
  <Icon size="md" className={styles.root}>
    check_circled
  </Icon>
);

export default ApprovedIcon;
