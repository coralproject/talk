import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Button } from "coral-ui/components/v3";

import styles from "./shared.css";

interface Props {
  onClick: () => void;
  disableButton?: boolean;
}

const AddMessageClosed: FunctionComponent<Props> = ({
  disableButton,
  onClick,
}) => {
  return (
    <div className={CLASSES.openCommentStream.$root}>
      <Localized id="configure-addMessage-title">
        <div className={styles.heading} id="configure-addMessage-title">
          Add a message or question
        </div>
      </Localized>
      <Localized id="configure-addMessage-description">
        <div className={styles.description}>
          Add a message to the top of the comment box for your readers. Use this
          to pose a topic, ask a question or make announcements relating to this
          story.
        </div>
      </Localized>
      <Localized id="configure-addMessage-addMessage">
        <Button
          variant="filled"
          color="secondary"
          className={CLASSES.openCommentStream.openButton}
          onClick={onClick}
          disabled={disableButton}
          upperCase
          data-testid="configure-addMessage"
        >
          Add message
        </Button>
      </Localized>
    </div>
  );
};

export default AddMessageClosed;
