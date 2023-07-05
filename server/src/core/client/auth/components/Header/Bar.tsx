import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components/v2";

import styles from "./Bar.css";

export interface BarProps {
  children: React.ReactNode;
}

const Bar: FunctionComponent<BarProps> = (props) => (
  <Flex className={styles.root} alignItems="center" justifyContent="center">
    <header>{props.children}</header>
  </Flex>
);

export default Bar;
