import React, { FunctionComponent } from "react";

import { HorizontalGutter } from "coral-ui/components";

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
      <p>
        <span className={styles.category}>{category}</span>
      </p>
      <HorizontalGutter size="half">{children}</HorizontalGutter>
    </HorizontalGutter>
  );
};

export default FlagDetailsCategory;
