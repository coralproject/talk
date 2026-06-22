import React, { FunctionComponent } from "react";

import styles from "./KlipyMedia.css";

interface Props {
  url: string;
  title?: string | null;
}

const KlipyMedia: FunctionComponent<Props> = ({ url, title }) => {
  return (
    <div className={styles.klipyMedia}>
      <img
        src={url}
        loading="lazy"
        referrerPolicy="no-referrer"
        alt={title || ""}
      />
    </div>
  );
};

export default KlipyMedia;
