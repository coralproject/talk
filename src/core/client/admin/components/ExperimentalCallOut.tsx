import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { CallOut, Flex, Icon } from "coral-ui/components/v2";

import styles from "./ExperimentalCallOut.css";

const ExperimentalCallOut: FunctionComponent = ({ children }) => (
  <CallOut color="primary" fullWidth>
    <Flex>
      <Icon size="md" className={styles.icon}>
        new_releases
      </Icon>
      <Localized id="configure-experimentalFeature">
        <span className={styles.title}>Experimental Feature</span>
      </Localized>
    </Flex>
    <span>{children}</span>
  </CallOut>
);

export default ExperimentalCallOut;
