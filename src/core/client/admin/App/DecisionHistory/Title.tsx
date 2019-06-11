import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Flex, Icon, Typography } from "coral-ui/components";

import styles from "./Title.css";

const Title: FunctionComponent = () => (
  <Flex className={styles.root} alignItems="center">
    <Icon>history</Icon>{" "}
    <Localized id="decisionHistory-yourDecisionHistory">
      <Typography container="span" className={styles.text}>
        Your Decision History
      </Typography>
    </Localized>
  </Flex>
);

export default Title;
