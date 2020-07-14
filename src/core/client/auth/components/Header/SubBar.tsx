import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components/v2";

import styles from "./SubBar.css";

export interface SubBarProps {
  children: React.ReactNode;
}

const SubBar: FunctionComponent<SubBarProps> = (props) => (
  <Flex className={styles.root} alignItems="center" justifyContent="center">
    <nav>{props.children}</nav>
  </Flex>
);

export default SubBar;
