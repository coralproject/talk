import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Button, Flex, Typography } from "coral-ui/components";

import styles from "./DisableQA.css";

interface Props {
  onClick: () => void;
  disableButton?: boolean;
}

const DisableQA: FunctionComponent<Props> = ({ onClick, disableButton }) => (
  <div className={CLASSES.openCommentStream.$root}>
    <Localized id="configure-disableQA-title">
      <Typography variant="heading2" className={styles.heading}>
        Configure this Q&A
      </Typography>
    </Localized>
    <Flex alignItems="flex-start" itemGutter>
      <Localized id="configure-disableQA-description">
        <Typography>
          The Q&A format allows community members to submit questions for chosen
          experts to answer.
        </Typography>
      </Localized>
      <Localized id="configure-disableQA-disableQA">
        <Button
          variant="outlined"
          color="primary"
          className={cn(styles.button, CLASSES.openCommentStream.openButton)}
          onClick={onClick}
          disabled={disableButton}
        >
          Switch to Comments
        </Button>
      </Localized>
    </Flex>
  </div>
);

export default DisableQA;
