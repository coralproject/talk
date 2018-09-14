import dompurify from "dompurify";
import React, { StatelessComponent } from "react";

import styles from "./HTMLContent.css";

interface HTMLContentProps {
  children: string;
}

const HTMLContent: StatelessComponent<HTMLContentProps> = ({ children }) => (
  <div
    className={styles.root}
    dangerouslySetInnerHTML={{ __html: dompurify.sanitize(children) }}
  />
);

export default HTMLContent;
