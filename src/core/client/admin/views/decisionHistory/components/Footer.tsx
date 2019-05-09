import React, { FunctionComponent } from "react";

import { Flex } from "talk-ui/components";

import styles from "./Footer.css";

interface Props {
  children: React.ReactNode;
}

const Footer: FunctionComponent<Props> = props => (
  <Flex className={styles.root} alignItems="baseline">
    {props.children}
  </Flex>
);

export default Footer;
