import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Button } from "coral-ui/components/v3";

import styles from "./OpenStream.css";

interface Props {
  onClick: () => void;
  disableButton?: boolean;
}

const OpenStream: FunctionComponent<Props> = ({ onClick, disableButton }) => (
  <div className={CLASSES.openCommentStream.$root}>
    <Localized id="configure-openStream-title">
      <div className={styles.heading} id="configure-openStream-title">
        Open Stream
      </div>
    </Localized>
    <Localized id="configure-openStream-description">
      <div className={styles.description}>
        This comment stream is currently closed. By opening this comment stream
        new comments may be submitted and displayed
      </div>
    </Localized>
    <Localized id="configure-openStream-openStream">
      <Button
        variant="outlined"
        color="secondary"
        className={CLASSES.openCommentStream.openButton}
        onClick={onClick}
        disabled={disableButton}
        upperCase
      >
        Open Stream
      </Button>
    </Localized>
  </div>
);

export default OpenStream;
