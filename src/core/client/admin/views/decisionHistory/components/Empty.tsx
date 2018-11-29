import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Flex, Typography } from "talk-ui/components";

import styles from "./Empty.css";

const Empty: StatelessComponent<{}> = () => (
  <Flex justifyContent="center" alignItems="center" className={styles.root}>
    <Localized id="decisionHistory-youWillSeeAList">
      <Typography>
        You will see a list of your post moderation actions here.
      </Typography>
    </Localized>
  </Flex>
);

export default Empty;
