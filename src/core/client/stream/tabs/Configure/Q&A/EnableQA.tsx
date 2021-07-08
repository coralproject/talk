import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Flex } from "coral-ui/components/v2";
import { Button, ExperimentalTag } from "coral-ui/components/v3";

import styles from "./EnableQA.css";

interface Props {
  onClick: () => void;
  disableButton?: boolean;
}

const EnableQA: FunctionComponent<Props> = ({ onClick, disableButton }) => (
  <div className={CLASSES.openCommentStream.$root}>
    <Flex alignItems="center">
      <Localized id="configure-enableQA-switchToQA">
        <div className={styles.heading} id="configure-enableQA-title">
          Switch to Q&A format
        </div>
      </Localized>
      <div className={styles.experimental}>
        <ExperimentalTag
          content={
            <Localized id="qa-experimentalTag-tooltip-content">
              The Q&A format is currently in active development. Please contact
              us with any feedback or requests.
            </Localized>
          }
        />
      </div>
    </Flex>
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
