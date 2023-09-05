import React, { FunctionComponent } from "react";

import styles from "./AccountStatusCalloutMessage.css";

interface Props {
  message: string;
}

const AccountStatusCalloutMessage: FunctionComponent<Props> = ({ message }) => {
  return <blockquote className={styles.message}>{message}</blockquote>;
};

export default AccountStatusCalloutMessage;
