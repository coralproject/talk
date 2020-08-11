import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import styles from "./Warning.css";

interface Props {
  message: string;
  onAcknowledge: () => void;
}

const Warning: FunctionComponent<Props> = ({ message, onAcknowledge }) => {
  return (
    <CallOut
      color="error"
      iconColor="none"
      icon={
        <Icon size="sm" className={styles.icon}>
          timer
        </Icon>
      }
      borderPosition="top"
      title={<Localized id="warning-heading">Warning</Localized>}
    >
      <p>{message}</p>
      <Button onClick={onAcknowledge}>Acknowledge</Button>
    </CallOut>
  );
};

export default Warning;
