import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Button } from "coral-ui/components/v3";

import styles from "./DisableLiveUpdates.css";

interface Props {
  onClick: () => void;
  disableButton?: boolean;
}

const DisableLiveUpdates: FunctionComponent<Props> = ({
  onClick,
  disableButton,
}) => (
  <div className={CLASSES.openCommentStream.$root}>
    <Localized id="configure-disableLiveUpdates-title">
      <div className={styles.heading}>Disable live updates</div>
    </Localized>
    <Localized id="configure-disableLiveUpdates-description">
      <div className={styles.description}>
        When disabled, new comments and replies will no longer instantly update
        as they are submitted. Commenters will need to refresh the page to see
        new comments. We recommend this in the unusual situation of a story
        getting so much traffic that the comments are loading slowly.
      </div>
    </Localized>
    <Localized id="configure-disableLiveUpdates-disable">
      <Button
        variant="filled"
        color="secondary"
        className={CLASSES.openCommentStream.openButton}
        onClick={onClick}
        disabled={disableButton}
        upperCase
      >
        Disable
      </Button>
    </Localized>
  </div>
);

export default DisableLiveUpdates;
