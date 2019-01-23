import React, { StatelessComponent } from "react";

import styles from "./ExternalLink.css";

const ExternalLink: StatelessComponent<{
  href?: string;
  children?: string;
}> = ({ href, children }) => (
  <a href={href || children} target="_blank" className={styles.root}>
    {children}
  </a>
);

export default ExternalLink;
