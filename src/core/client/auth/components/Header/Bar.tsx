import React from "react";
import { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

import styles from "./Bar.css";

export interface BarProps {
  children: React.ReactNode;
}

const Bar: StatelessComponent<BarProps> = props => (
  <Flex className={styles.root} alignItems="center" justifyContent="center">
    <div>{props.children}</div>
  </Flex>
);

export default Bar;
