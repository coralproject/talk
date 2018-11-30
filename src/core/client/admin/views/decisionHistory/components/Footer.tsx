import React, { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

import styles from "./Footer.css";

interface Props {
  children: React.ReactNode;
}

const Footer: StatelessComponent<Props> = props => (
  <Flex className={styles.root} alignItems="baseline">
    {props.children}
  </Flex>
);

export default Footer;
