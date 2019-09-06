import React, { FunctionComponent } from "react";

import { HorizontalGutter } from "coral-ui/components";

import styles from "./SectionContent.css";

interface Props {
  children?: React.ReactNode;
}

const SectionContent: FunctionComponent<Props> = ({ children }) => {
  return (
    <HorizontalGutter size="double" className={styles.sectionContent}>
      {children}
    </HorizontalGutter>
  );
};

export default SectionContent;
