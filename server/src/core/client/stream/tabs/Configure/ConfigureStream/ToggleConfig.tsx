import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { CheckBox } from "coral-ui/components/v2";

import styles from "./ToggleConfig.css";

export interface Props extends Omit<PropTypesOf<typeof CheckBox>, "children"> {
  title: React.ReactNode;
  children?: React.ReactNode;
}

const ToggleConfig: FunctionComponent<Props> = (props) => {
  const { title, children, ...rest } = props;
  return (
    <div>
      <CheckBox {...rest} variant="streamBlue">
        <div className={styles.title}>{title}</div>
      </CheckBox>
      {children && <div className={styles.details}>{children}</div>}
    </div>
  );
};

export default ToggleConfig;
