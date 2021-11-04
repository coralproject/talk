import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { HorizontalGutter, Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import AccountStatusCalloutMessage from "../AccountStatusCalloutMessage";

interface Props {
  message: string;
  onAcknowledge: () => void;
}

const Warning: FunctionComponent<Props> = ({ message, onAcknowledge }) => {
  return (
    <CallOut
      color="error"
      iconColor="none"
      icon={<Icon size="sm">report</Icon>}
      borderPosition="top"
      title={
        <Localized id="warning-heading">
          Your account has been issued a warning
        </Localized>
      }
    >
      <HorizontalGutter spacing={3}>
        <Localized id="warning-explanation">
          <p>
            In accordance with our community guidelines your account has been
            issued a warning.
          </p>
        </Localized>
        <AccountStatusCalloutMessage message={message} />
        <Localized id="warning-instructions">
          <p>
            To continue participating in discussions please press the
            "Acknowledge" button below.
          </p>
        </Localized>
        <Localized id="warning-acknowledge">
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

export default Warning;
