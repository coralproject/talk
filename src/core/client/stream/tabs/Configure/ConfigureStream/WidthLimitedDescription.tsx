import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { CheckBox, Typography } from "coral-ui/components";

import styles from "./WidthLimitedDescription.css";

export interface Props extends Omit<PropTypesOf<typeof CheckBox>, "children"> {
  children?: React.ReactNode;
}

const WidthLimitedDescription: FunctionComponent<Props> = (props) => {
  return (
    <Typography variant="detail" color="textSecondary" className={styles.root}>
      {props.children}
    </Typography>
  );
};

export default WidthLimitedDescription;
