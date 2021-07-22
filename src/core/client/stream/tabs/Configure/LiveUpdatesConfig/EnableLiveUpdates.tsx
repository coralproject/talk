import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Button } from "coral-ui/components/v3";

import styles from "./EnableLiveUpdates.css";

interface Props {
  onClick: () => void;
  disableButton?: boolean;
}

const EnableLiveUpdates: FunctionComponent<Props> = ({
  onClick,
  disableButton,
}) => (
  <div className={CLASSES.openCommentStream.$root}>
    <Localized id="configure-enableLiveUpdates-title">
      <div className={styles.heading} id="configure-enableLiveUpdates-title">
        Enable live updates
      </div>
    </Localized>
    <Localized id="configure-enableLiveUpdates-description">
      <div className={styles.description}>
        When enabled, the comments will be updated instantly as new comments and
        replies are submitted, instead of requiring a page refresh. You can
        disable this in the unusual situation of an article getting so much
        traffic that the comments are loading slowly.
      </div>
    </Localized>
    <Localized id="configure-enableLiveUpdates-enable">
      <Button
        variant="filled"
        color="secondary"
        className={CLASSES.openCommentStream.openButton}
        onClick={onClick}
        disabled={disableButton}
        upperCase
      >
        Enable
      </Button>
    </Localized>
  </div>
);

export default EnableLiveUpdates;
