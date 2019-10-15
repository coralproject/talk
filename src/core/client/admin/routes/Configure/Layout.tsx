import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components";

import styles from "./Layout.css";

const Layout: FunctionComponent = ({ children }) => (
  <Flex className={styles.root}>{children}</Flex>
);

export default Layout;
