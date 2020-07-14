import React, { FunctionComponent } from "react";

import styles from "./Media.css";

interface Props {
  url: string;
  width: number | null;
}

const TwitterMedia: FunctionComponent<Props> = ({ url, width }) => {
  const cleanUrl = encodeURIComponent(url);
  return (
    <div className={styles.embed}>
      <iframe
        frameBorder="0"
        width={width || 450}
        allowFullScreen
        title="oEmbed"
        src={`/api/oembed?type=twitter&url=${cleanUrl}`}
      />
    </div>
  );
};

export default TwitterMedia;
