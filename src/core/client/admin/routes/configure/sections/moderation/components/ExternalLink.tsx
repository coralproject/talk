import React, { StatelessComponent } from "react";

import styles from "./ExternalLink.css";

const ExternalLink: StatelessComponent<{
  children?: string;
}> = ({ children }) => (
  <a href={children} target="_blank" className={styles.root}>
    {children}
  </a>
);

export default ExternalLink;
