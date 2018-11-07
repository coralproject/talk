import React, { StatelessComponent } from "react";

import { CheckBox, Flex } from "talk-ui/components";

import styles from "./ConfigBox.css";

interface Props {
  enabled?: boolean;
  title?: React.Component<any> | string;
  children: React.ReactNode;
}

const ConfigBox: StatelessComponent<Props> = ({ title, children }) => (
  <div className={styles.root}>
    <Flex className={styles.title} justifyContent="space-between">
      <div>{title}</div>
      <div>
        <CheckBox light>Enabled</CheckBox>
      </div>
    </Flex>
    <div className={styles.content}>{children}</div>
  </div>
);

export default ConfigBox;
