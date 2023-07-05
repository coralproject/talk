import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components/v2";

import styles from "./Empty.css";

const Empty: FunctionComponent<{}> = () => (
  <Flex justifyContent="center" alignItems="center" className={styles.root}>
    <Localized id="decisionHistory-youWillSeeAList">
      <div className={styles.text}>
        You will see a list of your post moderation actions here.
      </div>
    </Localized>
  </Flex>
);

export default Empty;
