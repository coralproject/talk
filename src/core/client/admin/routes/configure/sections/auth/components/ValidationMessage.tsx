import React, { StatelessComponent } from "react";

import { ValidationMessage as UIValidationMessage } from "talk-ui/components";

interface Props {
  children: React.ReactNode;
}

import styles from "./ValidationMessage.css";

const ValidationMessage: StatelessComponent<Props> = ({ children }) => (
  <UIValidationMessage className={styles.root}>{children}</UIValidationMessage>
);

export default ValidationMessage;
