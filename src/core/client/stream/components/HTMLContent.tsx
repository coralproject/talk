import cn from "classnames";
import dompurify from "dompurify";
import React, { StatelessComponent } from "react";

import styles from "./HTMLContent.css";

interface HTMLContentProps {
  children: string;
  className?: string;
}

const HTMLContent: StatelessComponent<HTMLContentProps> = ({
  children,
  className,
}) => (
  <div
    className={cn(styles.root, className)}
    dangerouslySetInnerHTML={{ __html: dompurify.sanitize(children) }}
  />
);

export default HTMLContent;
