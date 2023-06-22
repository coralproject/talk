import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { SvgIcon, TimeReverseIcon } from "coral-ui/components/icons";
import { Flex } from "coral-ui/components/v2";

import styles from "./Title.css";

const Title: FunctionComponent = () => (
  <Flex className={styles.root} alignItems="center">
    <SvgIcon className={styles.icon} size="md" Icon={TimeReverseIcon} />
    <Localized id="decisionHistory-yourDecisionHistory">
      <span className={styles.text}>Your Decision History</span>
    </Localized>
  </Flex>
);

export default Title;
