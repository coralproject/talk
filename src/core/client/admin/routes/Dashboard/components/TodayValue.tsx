import React, { FunctionComponent } from "react";

import { HorizontalGutter } from "coral-ui/components/v2";

import styles from "./TodayValue.css";

interface Props {
  value?: string;
  children?: React.ReactNode;
}

const TodayValue: FunctionComponent<Props> = ({ value = "-", children }) => {
  return (
    <HorizontalGutter spacing={1}>
      <p className={styles.valueBoxValue}>{value}</p>
      <p className={styles.valueBoxName}>{children}</p>
    </HorizontalGutter>
  );
};

export default TodayValue;
