import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { HorizontalGutter, Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

// todo: should these message styles be shared somewhere instead of duplicated?
import styles from "./ModMessage.css";

interface Props {
  message: string;
  onAcknowledge: () => void;
}

const ModMessage: FunctionComponent<Props> = ({ message, onAcknowledge }) => {
  return (
    <CallOut
      color="primary"
      iconColor="none"
      icon={<Icon size="sm">report</Icon>}
      borderPosition="top"
      title={
        // todo: actually add to localization
        <Localized id="modMessage-heading">
          Your account has been sent a message from a moderator
        </Localized>
      }
    >
      <HorizontalGutter spacing={3}>
        {/* todo: actually add to localization */}
        {/* <Localized id="modMessage-explanation">
          <p>
            In accordance with our community guidelines your account has been
            issued a warning.
          </p>
        </Localized> */}
        <blockquote className={styles.message}>{message}</blockquote>
        {/* todo: actually add to localization */}
        <Localized id="modMessage-instructions">
          <p>
            So that we know you've seen this message, please press the
            "Acknowledge" button below.
          </p>
        </Localized>
        {/* todo: actually add to localization */}
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
