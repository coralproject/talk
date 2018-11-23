import { Localized } from "fluent-react/compat";
import React from "react";
import { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

import styles from "./OrSeparator.css";

const OrSeparator: StatelessComponent = props => (
  <Flex className={styles.root} alignItems="center" justifyContent="center">
    <hr className={styles.hr} />

    <Localized id="general-orSeparator">
      <div className={styles.text}>Or</div>
    </Localized>
  </Flex>
);

export default OrSeparator;
