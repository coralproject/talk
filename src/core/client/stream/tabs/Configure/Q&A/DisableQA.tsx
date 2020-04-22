import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Button } from "coral-ui/components/v3";

import ExpertSelectionQuery from "./ExpertSelectionQuery";

import styles from "./DisableQA.css";

interface Props {
  storyID: string;
  onClick: () => void;
  disableButton?: boolean;
}

const DisableQA: FunctionComponent<Props> = ({
  onClick,
  disableButton,
  storyID,
}) => (
  <div className={CLASSES.openCommentStream.$root}>
    <Localized id="configure-disableQA-title">
      <div className={styles.heading}>Configure this Q&A</div>
    </Localized>
    <Localized id="configure-disableQA-description">
      <div className={styles.description}>
        The Q&A format allows community members to submit questions for chosen
        experts to answer.
      </div>
    </Localized>
    <ExpertSelectionQuery storyID={storyID} />
    <Localized id="configure-disableQA-disableQA">
      <Button
        variant="filled"
        color="secondary"
        className={CLASSES.openCommentStream.openButton}
        onClick={onClick}
        disabled={disableButton}
        upperCase
      >
        Switch to Comments
      </Button>
    </Localized>
  </div>
);

export default DisableQA;
