import React, { FunctionComponent } from "react";

import { Flex } from "talk-ui/components";

import styles from "./DecisionItem.css";

interface Props {
  icon: React.ReactNode;
  children: React.ReactNode;
}

const DecisionItem: FunctionComponent<Props> = props => (
  <li className={styles.root}>
    <Flex>
      <div className={styles.leftCol}>{props.icon}</div>
      <div>{props.children}</div>
    </Flex>
  </li>
);

export default DecisionItem;
