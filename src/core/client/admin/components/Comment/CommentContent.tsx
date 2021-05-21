import cn from "classnames";
import React, { FunctionComponent } from "react";

import { GetPhrasesRegExpOptions } from "coral-admin/helpers";

import styles from "./CommentContent.css";
import CommentParser from "./CommentParser";

interface Props {
  className?: string;
  children: string | React.ReactElement;
  phrases?: GetPhrasesRegExpOptions;
  highlight?: boolean;
}

const CommentContent: FunctionComponent<Props> = ({
  phrases,
  className,
  children,
  highlight = false,
}) => {
  return (
    <CommentParser
      phrases={phrases}
      highlight={highlight}
      className={cn(className, styles.root, highlight && styles.highlight)}
    >
      {children}
    </CommentParser>
  );
};

export default CommentContent;
