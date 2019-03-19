import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Button, Flex, Typography } from "talk-ui/components";

import styles from "./OpenStream.css";

interface Props {
  onClick: () => void;
  disableButton?: boolean;
}

const OpenStream: StatelessComponent<Props> = ({ onClick, disableButton }) => (
  <div>
    <Localized id="configure-openStream-title">
      <Typography variant="heading2" className={styles.heading}>
        Open Stream
      </Typography>
    </Localized>
    <Flex alignItems="flex-start" itemGutter>
      <Localized id="configure-openStream-description">
        <Typography>
          This comment stream is currently closed. By opening this comment
          stream new comments may be submitted and displayed
        </Typography>
      </Localized>
      <Localized id="configure-openStream-openStream">
        <Button
          variant="outlined"
          color="error"
          className={styles.button}
          onClick={onClick}
          disabled={disableButton}
        >
          Open Stream
        </Button>
      </Localized>
    </Flex>
  </div>
);

export default OpenStream;
