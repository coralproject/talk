import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { HorizontalGutter, Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import AccountStatusCalloutMessage from "../AccountStatusCalloutMessage";

interface Props {
  message: string;
  onAcknowledge: () => void;
}

const ModMessage: FunctionComponent<Props> = ({ message, onAcknowledge }) => {
  return (
    <CallOut
      color="primary"
      iconColor="none"
      icon={
        <Icon size="sm" color="stream">
          message
        </Icon>
      }
      borderPosition="top"
      title={
        <Localized id="modMessage-heading">
          Your account has been sent a message by a moderator
        </Localized>
      }
    >
      <HorizontalGutter spacing={3}>
        <AccountStatusCalloutMessage message={message} />
        <Localized id="modMessage-acknowledge">
          <Button
            paddingSize="extraSmall"
            color="secondary"
            onClick={onAcknowledge}
          >
            Acknowledge
          </Button>
        </Localized>
      </HorizontalGutter>
    </CallOut>
  );
};

export default ModMessage;
