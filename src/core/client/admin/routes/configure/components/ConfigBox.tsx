import React, { StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

import styles from "./ConfigBox.css";

interface Props {
  id?: string;
  topRight?: React.ReactElement<any>;
  title?: React.ReactNode;
  children: React.ReactNode;
}

const ConfigBox: StatelessComponent<Props> = ({
  id,
  title,
  topRight,
  children,
  ...rest
}) => (
  <div {...rest} className={styles.root} id={id}>
    <Flex className={styles.title} justifyContent="space-between">
      <div>{title}</div>
      <div>{topRight}</div>
    </Flex>
    <div className={styles.content}>{children}</div>
  </div>
);

export default ConfigBox;
