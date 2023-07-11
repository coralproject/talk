import { Localized } from "@fluent/react/compat";
import CLASSES from "coral-stream/classes";
import React, { FunctionComponent } from "react";

import { CommentBoxIcon, SvgIcon } from "coral-ui/components/icons";
import { HorizontalGutter } from "coral-ui/components/v2";
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
      className={CLASSES.modMessage.$root}
      icon={<SvgIcon color="stream" Icon={CommentBoxIcon} />}
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
