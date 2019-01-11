import React from "react";
import { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

import styles from "./HorizontalSeparator.css";

interface Props {
  children: string;
}

const HorizontalSeparator: StatelessComponent<Props> = props => (
  <Flex className={styles.root} alignItems="center" justifyContent="center">
    <hr className={styles.hr} />
    <div className={styles.text}>{props.children}</div>
  </Flex>
);

export default HorizontalSeparator;
