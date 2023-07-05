import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components/v2";

import styles from "./Layout.css";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }) => (
  <Flex className={styles.root}>{children}</Flex>
);

export default Layout;
