import React, { StatelessComponent } from "react";

import { Omit, PropTypesOf } from "talk-framework/types";
import { CheckBox, Typography } from "talk-ui/components";

import styles from "./WidthLimitedDescription.css";

export interface Props extends Omit<PropTypesOf<typeof CheckBox>, "children"> {
  children?: React.ReactNode;
}

const WidthLimitedDescription: StatelessComponent<Props> = props => {
  return (
    <Typography variant="detail" color="textSecondary" className={styles.root}>
      {props.children}
    </Typography>
  );
};

export default WidthLimitedDescription;
