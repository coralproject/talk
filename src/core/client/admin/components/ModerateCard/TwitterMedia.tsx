import React, { FunctionComponent } from "react";

import styles from "./Media.css";

interface Props {
  url: string;
  width: number | null;
  siteID: string;
}

const TwitterMedia: FunctionComponent<Props> = ({ url, width, siteID }) => {
  const cleanUrl = encodeURIComponent(url);
  return (
    <div className={styles.embed}>
      <iframe
        frameBorder="0"
        width={width || 450}
        allowFullScreen
        title="oEmbed"
        src={`/api/oembed?type=twitter&url=${cleanUrl}&siteID=${siteID}`}
      />
    </div>
  );
};

export default TwitterMedia;
