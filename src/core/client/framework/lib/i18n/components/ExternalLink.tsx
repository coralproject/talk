import React, { FunctionComponent } from "react";

import styles from "./ExternalLink.css";

const ExternalLink: FunctionComponent<{
  href?: string;
  children?: string;
}> = ({ href, children }) => (
  <a href={href || children} target="_blank" className={styles.root}>
    {children}
  </a>
);

export default ExternalLink;
