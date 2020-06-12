import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { CheckBox } from "coral-ui/components/v2";

import styles from "./WidthLimitedDescription.css";

export interface Props extends Omit<PropTypesOf<typeof CheckBox>, "children"> {
  children?: React.ReactNode;
}

const WidthLimitedDescription: FunctionComponent<Props> = (props) => {
  return <div className={styles.root}>{props.children}</div>;
};

export default WidthLimitedDescription;
