import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./ExternalLink.css";

const ExternalLink: FunctionComponent<{
  href?: string;
  children?: string;
  className?: string;
}> = ({ href, children, className }) => (
  <a
    href={href || children}
    target="_blank"
    /**
     * Added as a security workaround as per:
     *
     * https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
     */
    rel="noopener noreferrer"
    className={cn(styles.root, className)}
  >
    {children}
  </a>
);

export default ExternalLink;
