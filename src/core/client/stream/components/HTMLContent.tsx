import cn from "classnames";
import React, { StatelessComponent } from "react";

import { createPurify } from "talk-common/utils/purify";

import styles from "./HTMLContent.css";

/**
 * Create a purify instance that will be used to handle HTML content.
 */
const purify = createPurify(window, false);

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
    dangerouslySetInnerHTML={{ __html: purify.sanitize(children) }}
  />
);

export default HTMLContent;
