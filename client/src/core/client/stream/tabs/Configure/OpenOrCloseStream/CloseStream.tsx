import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Button } from "coral-ui/components/v3";

import styles from "./CloseStream.css";

interface Props {
  onClick: () => void;
  disableButton?: boolean;
}

const CloseStream: FunctionComponent<Props> = ({ onClick, disableButton }) => (
  <div className={CLASSES.closeCommentStream.$root}>
    <Localized id="configure-closeStream-closeCommentStream">
      <div className={styles.heading} id="configure-closeStream-title">
        Close comment stream
      </div>
    </Localized>
    <Localized id="configure-closeStream-description">
      <div className={styles.description}>
        This comment stream is currently open. By closing this comment stream,
        no new comments may be submitted and all previously submitted comments
        will still be displayed.
      </div>
    </Localized>
    <Localized id="configure-closeStream-closeStream">
      <Button
        variant="filled"
        color="error"
        className={CLASSES.closeCommentStream.closeButton}
        onClick={onClick}
        disabled={disableButton}
        upperCase
      >
        Close Stream
      </Button>
    </Localized>
  </div>
);

export default CloseStream;
