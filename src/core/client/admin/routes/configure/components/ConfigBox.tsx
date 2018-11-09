import React, { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

import styles from "./ConfigBox.css";

interface Props {
  topRight?: React.ReactElement<any>;
  title?: React.ReactNode;
  children: React.ReactNode;
}

const ConfigBox: StatelessComponent<Props> = ({
  title,
  topRight,
  children,
}) => (
  <div className={styles.root}>
    <Flex className={styles.title} justifyContent="space-between">
      <div>{title}</div>
      <div>{topRight}</div>
    </Flex>
    <div className={styles.content}>{children}</div>
  </div>
);

export default ConfigBox;
