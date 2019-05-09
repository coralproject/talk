import React, { FunctionComponent } from "react";

import { Omit, PropTypesOf } from "talk-framework/types";
import { CheckBox, Typography } from "talk-ui/components";

import styles from "./ToggleConfig.css";

export interface Props extends Omit<PropTypesOf<typeof CheckBox>, "children"> {
  title: React.ReactNode;
  children?: React.ReactNode;
}

const ToggleConfig: FunctionComponent<Props> = props => {
  const { title, children, ...rest } = props;
  return (
    <div>
      <CheckBox {...rest}>
        <Typography variant="heading3" container="span">
          {title}
        </Typography>
      </CheckBox>
      {children && <div className={styles.details}>{children}</div>}
    </div>
  );
};

export default ToggleConfig;
