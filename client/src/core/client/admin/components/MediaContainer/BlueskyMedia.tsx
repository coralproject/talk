import React, { FunctionComponent } from "react";

import Frame from "coral-framework/components/Frame";

import styles from "./Media.css";

interface Props {
  id: string;
  url: string;
  siteID: string;
}

const BlueskyMedia: FunctionComponent<Props> = ({ id, url, siteID }) => {
  const component = encodeURIComponent(url);
  return (
    <div className={styles.embed}>
      <Frame
        id={id}
        src={`/api/oembed?type=bsky&url=${component}&siteID=${siteID}`}
        width="100%"
        showFullHeight
      />
    </div>
  );
};

export default BlueskyMedia;
