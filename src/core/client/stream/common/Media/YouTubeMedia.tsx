import React, { FunctionComponent } from "react";

import Frame from "coral-framework/components/Frame";

import styles from "./YouTubeMedia.css";

interface Props {
  id?: string;
  url: string;
  siteID: string;
}

const YouTubeMedia: FunctionComponent<Props> = ({ id, url, siteID }) => {
  const component = encodeURIComponent(url);
  return (
    <div className={styles.container}>
      <Frame
        id={id}
        width="100%"
        src={`/api/oembed?type=youtube&url=${component}&siteID=${siteID}`}
      />
    </div>
  );
};

export default YouTubeMedia;
