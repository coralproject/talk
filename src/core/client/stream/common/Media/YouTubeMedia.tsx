import React, { FunctionComponent } from "react";

import Frame from "coral-framework/components/Frame";

import styles from "./YouTubeMedia.css";

interface Props {
  id?: string;
  url: string;
  siteID: string;
  isToggled?: boolean;
}

const YouTubeMedia: FunctionComponent<Props> = ({
  id,
  url,
  siteID,
  isToggled,
}) => {
  const component = encodeURIComponent(url);
  return (
    <div className={styles.container}>
      <Frame
        id={id}
        width="75%"
        src={`/api/oembed?type=youtube&url=${component}&siteID=${siteID}`}
        isToggled={isToggled}
        type="youtube"
      />
    </div>
  );
};

export default YouTubeMedia;
