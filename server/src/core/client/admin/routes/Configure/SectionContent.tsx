import React, { FunctionComponent } from "react";

import { HorizontalGutter } from "coral-ui/components/v2";

import styles from "./SectionContent.css";

interface Props {
  children?: React.ReactNode;
}

const SectionContent: FunctionComponent<Props> = ({ children }) => {
  return (
    <HorizontalGutter spacing={4} className={styles.sectionContent}>
      {children}
    </HorizontalGutter>
  );
};

export default SectionContent;
