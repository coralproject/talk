import React, { FunctionComponent } from "react";

import styles from "./Media.css";

interface Props {
  url: string;
  width: number | null;
  height: number | null;
  siteID: string;
}

const YouTubeMedia: FunctionComponent<Props> = ({
  url,
  width,
  height,
  siteID,
}) => {
  const cleanUrl = encodeURIComponent(url);
  return (
    <div className={styles.embed}>
      <iframe
        frameBorder="0"
        width={width || 450}
        allowFullScreen
        title="oEmbed"
        src={`/api/oembed?type=youtube&url=${cleanUrl}&siteID=${siteID}`}
      />
    </div>
  );
};

export default YouTubeMedia;
