import React, { StatelessComponent } from "react";

import { Icon } from "talk-ui/components";

import styles from "./AcceptedIcon.css";

const AcceptedIcon: StatelessComponent = () => (
  <Icon className={styles.root}>check</Icon>
);

export default AcceptedIcon;
