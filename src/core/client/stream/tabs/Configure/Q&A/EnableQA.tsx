import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Button, Flex, Typography } from "coral-ui/components";

import styles from "./EnableQA.css";

interface Props {
  onClick: () => void;
  disableButton?: boolean;
}

const EnableQA: FunctionComponent<Props> = ({ onClick, disableButton }) => (
  <div className={CLASSES.openCommentStream.$root}>
    <Localized id="configure-enableQA-title">
      <Typography variant="heading2" className={styles.heading}>
        Switch to Q&A Format
      </Typography>
    </Localized>
    <Flex alignItems="flex-start" itemGutter>
      <Localized id="configure-enableQA-description">
        <Typography>
          The Q&A format allows community members to submit questions for chosen
          experts to answer.
        </Typography>
      </Localized>
      <Localized id="configure-enableQA-enableQA">
        <Button
          variant="outlined"
          color="primary"
          className={cn(styles.button, CLASSES.openCommentStream.openButton)}
          onClick={onClick}
          disabled={disableButton}
        >
          Switch to Q&A
        </Button>
      </Localized>
    </Flex>
  </div>
);

export default EnableQA;
