import React, { FunctionComponent } from "react";

import { ValidationMessage as UIValidationMessage } from "coral-ui/components";
import { PropTypesOf } from "coral-ui/types";

import styles from "./ValidationMessage.css";

interface Props extends PropTypesOf<typeof UIValidationMessage> {
  children: React.ReactNode;
}

const ValidationMessage: FunctionComponent<Props> = ({ children, ...rest }) => (
  <UIValidationMessage {...rest} className={styles.root}>
    {children}
  </UIValidationMessage>
);

export default ValidationMessage;
