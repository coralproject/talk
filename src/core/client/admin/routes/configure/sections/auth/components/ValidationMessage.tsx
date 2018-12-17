import React, { StatelessComponent } from "react";

import { ValidationMessage as UIValidationMessage } from "talk-ui/components";

import styles from "./ValidationMessage.css";

interface Props {
  children: React.ReactNode;
}

const ValidationMessage: StatelessComponent<Props> = ({ children }) => (
  <UIValidationMessage className={styles.root}>{children}</UIValidationMessage>
);

export default ValidationMessage;
