import React, { FunctionComponent } from "react";

import { CallOut, Flex, Icon } from "coral-ui/components";
import { Localized } from "fluent-react/compat";

import styles from "./Sorry.css";

const Sorry: FunctionComponent = () => {
  return (
    <CallOut color="error" fullWidth className={styles.callout}>
      <Flex>
        <Icon size="md" className={styles.icon}>
          error
        </Icon>
        <Localized id="download-landingPage-sorry">
          Your download link is invalid.
        </Localized>
      </Flex>
    </CallOut>
  );
};

export default Sorry;
