import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components/v2";

import styles from "./HorizontalSeparator.css";

interface Props {
  children: string;
}

const HorizontalSeparator: FunctionComponent<Props> = (props) => (
  <Flex className={styles.root} alignItems="center" justifyContent="center">
    <hr className={styles.hr} />
    <div className={styles.text}>{props.children}</div>
  </Flex>
);

export default HorizontalSeparator;
