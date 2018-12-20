import React from "react";
import { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

import styles from "./SubBar.css";

export interface SubBarProps {
  children: React.ReactNode;
}

const SubBar: StatelessComponent<SubBarProps> = props => (
  <Flex className={styles.root} alignItems="center" justifyContent="center">
    <div>{props.children}</div>
  </Flex>
);

export default SubBar;
