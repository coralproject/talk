import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Markdown } from "coral-framework/components";
import CLASSES from "coral-stream/classes";

import styles from "./CommunityGuidelines.css";

interface Props {
  children: string;
}

const CommunityGuidelines: FunctionComponent<Props> = (props) => {
  return (
    <section
      className={cn(styles.root, CLASSES.guidelines.container)}
      aria-label="Community Guidelines"
    >
      <Markdown className={CLASSES.guidelines.content}>
        {props.children}
      </Markdown>
    </section>
  );
};

export default CommunityGuidelines;
