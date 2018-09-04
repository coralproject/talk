import React from "react";

import dompurify from "dompurify";
import styles from "./HTMLContent.css";

interface ContentProps {
  children: string;
}

class HTMLContent extends React.Component<ContentProps> {
  public render() {
    const { children } = this.props;
    return (
      <div
        className={styles.root}
        dangerouslySetInnerHTML={{ __html: dompurify.sanitize(children) }}
      />
    );
  }
}

export default HTMLContent;
