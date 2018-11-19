import React, { StatelessComponent } from "react";
import { Flex } from "talk-ui/components";

import styles from "./Layout.css";

const Layout: StatelessComponent = ({ children }) => (
  <Flex className={styles.root}>{children}</Flex>
);

export default Layout;
