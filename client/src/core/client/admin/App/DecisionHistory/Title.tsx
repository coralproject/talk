import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { Flex, Icon } from "coral-ui/components/v2";

import styles from "./Title.css";

const Title: FunctionComponent = () => (
  <Flex className={styles.root} alignItems="center">
    <Icon className={styles.icon} size="md">
      history
    </Icon>
    <Localized id="decisionHistory-yourDecisionHistory">
      <span className={styles.text}>Your Decision History</span>
    </Localized>
  </Flex>
);

export default Title;
