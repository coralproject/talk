import React, { FunctionComponent } from "react";

import { Icon } from "coral-ui/components";

import styles from "./AcceptedIcon.css";

const AcceptedIcon: FunctionComponent = () => (
  <Icon className={styles.root}>check</Icon>
);

export default AcceptedIcon;
