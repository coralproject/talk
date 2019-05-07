import React from "react";
import { FunctionComponent } from "react";

import { Flex } from "talk-ui/components";

import styles from "./SubBar.css";

export interface SubBarProps {
  children: React.ReactNode;
}

const SubBar: FunctionComponent<SubBarProps> = props => (
  <Flex className={styles.root} alignItems="center" justifyContent="center">
    <div>{props.children}</div>
  </Flex>
);

export default SubBar;
