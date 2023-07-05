import React, { FunctionComponent } from "react";

import { HorizontalGutter } from "coral-ui/components/v2";

import styles from "./TodayCompareValue.css";

interface Props {
  value?: string;
  children?: React.ReactNode;
}

const TodayCompareValue: FunctionComponent<Props> = ({
  value = "-",
  children,
}) => {
  return (
    <HorizontalGutter spacing={1}>
      <p className={styles.valueBoxCompareValue}>{value}</p>
      <p className={styles.valueBoxCompareName}>{children}</p>
    </HorizontalGutter>
  );
};

export default TodayCompareValue;
