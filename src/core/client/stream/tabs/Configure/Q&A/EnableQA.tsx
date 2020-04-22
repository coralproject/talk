import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Button } from "coral-ui/components/v3";

import styles from "./EnableQA.css";

interface Props {
  onClick: () => void;
  disableButton?: boolean;
}

const EnableQA: FunctionComponent<Props> = ({ onClick, disableButton }) => (
  <div className={CLASSES.openCommentStream.$root}>
    <Localized id="configure-enableQA-title">
      <div className={styles.heading}>Switch to Q&A Format</div>
    </Localized>
    <Localized id="configure-enableQA-description">
      <div className={styles.description}>
        The Q&A format allows community members to submit questions for chosen
        experts to answer.
      </div>
    </Localized>
    <Localized id="configure-enableQA-enableQA">
      <Button
        variant="filled"
        color="secondary"
        className={CLASSES.openCommentStream.openButton}
        onClick={onClick}
        disabled={disableButton}
        upperCase
      >
        Switch to Q&A
      </Button>
    </Localized>
  </div>
);

export default EnableQA;
