import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Button, Flex, Typography } from "coral-ui/components";

import styles from "./CloseStream.css";

interface Props {
  onClick: () => void;
  disableButton?: boolean;
}

const CloseStream: FunctionComponent<Props> = ({ onClick, disableButton }) => (
  <div className={CLASSES.closeCommentStream.$root}>
    <Localized id="configure-closeStream-title">
      <Typography variant="heading2" className={styles.heading}>
        Close Comment Stream
      </Typography>
    </Localized>
    <Flex alignItems="flex-start" itemGutter>
      <Localized id="configure-closeStream-description">
        <Typography>
          This comment stream is currently open. By closing this comment stream,
          no new comments may be submitted and all previously submitted comments
          will still be displayed.
        </Typography>
      </Localized>
      <Localized id="configure-closeStream-closeStream">
        <Button
          variant="outlined"
          color="error"
          className={cn(styles.button, CLASSES.closeCommentStream.closeButton)}
          onClick={onClick}
          disabled={disableButton}
        >
          Close Stream
        </Button>
      </Localized>
    </Flex>
  </div>
);

export default CloseStream;
