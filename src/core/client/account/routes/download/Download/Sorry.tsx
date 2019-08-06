import React, { FunctionComponent } from "react";

import { CallOut, Flex, HorizontalGutter, Icon } from "coral-ui/components";
import { Localized } from "fluent-react/compat";

import styles from "./Sorry.css";

const Sorry: FunctionComponent = () => {
  return (
    <HorizontalGutter size="double">
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
    </HorizontalGutter>
  );
};

export default Sorry;
