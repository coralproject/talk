import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Flex, Icon, Typography } from "talk-ui/components";

import styles from "./Title.css";

const Title: StatelessComponent = () => (
  <Flex className={styles.root} alignItems="center">
    <Icon>history</Icon>{" "}
    <Localized id="decisionHistory-title">
      <Typography container="span" className={styles.text}>
        Decision History
      </Typography>
    </Localized>
  </Flex>
);

export default Title;
