import React, { FunctionComponent } from "react";

import styles from "./TenorMedia.css";

interface Props {
  url: string;
  title?: string | null;
}

const TenorMedia: FunctionComponent<Props> = ({ url, title }) => {
  return (
    <div className={styles.tenorMedia}>
      <img
        src={url}
        loading="lazy"
        referrerPolicy="no-referrer"
        alt={title || ""}
      />
    </div>
  );
};

export default TenorMedia;
