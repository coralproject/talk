import React, { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

import styles from "./AppBar.css";
import Logo from "./Logo";

const AppBar: StatelessComponent = ({ children }) => (
  <div className={styles.root}>
    <Flex className={styles.container}>
      <Logo className={styles.logo} />
      {children}
    </Flex>
  </div>
);

export default AppBar;
