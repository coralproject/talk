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
        Enable Q&A
      </Typography>
    </Localized>
    <Flex alignItems="flex-start" itemGutter>
      <Localized id="configure-enableQA-description">
        <Typography>This will turn Q&A mode on for the stream.</Typography>
      </Localized>
      <Localized id="configure-enableQA-enableQA">
        <Button
          variant="outlined"
          color="primary"
          className={cn(styles.button, CLASSES.openCommentStream.openButton)}
          onClick={onClick}
          disabled={disableButton}
        >
          Enable Q&A
        </Button>
      </Localized>
    </Flex>
  </div>
);

export default EnableQA;
