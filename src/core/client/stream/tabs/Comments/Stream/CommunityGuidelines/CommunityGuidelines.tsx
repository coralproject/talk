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
    <div className={cn(styles.root, CLASSES.guidelines)}>
      <Markdown>{props.children}</Markdown>
    </div>
  );
};

export default CommunityGuidelines;
