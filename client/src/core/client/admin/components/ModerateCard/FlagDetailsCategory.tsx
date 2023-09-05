import React, { FunctionComponent } from "react";

import { HorizontalGutter } from "coral-ui/components/v2";

import styles from "./FlagDetailsCategory.css";

interface Props {
  category: React.ReactNode;
  children?: React.ReactNode;
}

const FlagDetailsCategory: FunctionComponent<Props> = ({
  category,
  children,
}) => {
  return (
    <HorizontalGutter size="half">
      <p className={styles.category}>{category}</p>
      <HorizontalGutter size="half">{children}</HorizontalGutter>
    </HorizontalGutter>
  );
};

export default FlagDetailsCategory;
