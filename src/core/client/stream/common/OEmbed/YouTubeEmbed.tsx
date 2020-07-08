import React, { FunctionComponent } from "react";

import OEmbed from "./OEmbed";

import styles from "./YouTubeEmbed.css";

interface Props {
  url: string;
  width?: string | null;
  height?: string | null;
}

const YouTubeEmbed: FunctionComponent<Props> = ({ url, height, width }) => {
  const paddingBottom =
    width && height
      ? `${(parseInt(height, 10) / parseInt(width, 10)) * 100}%`
      : null;
  let style = {};
  if (paddingBottom) {
    style = { paddingBottom };
  }
  return (
    <div className={styles.root} style={style}>
      <OEmbed
        url={url}
        type="youtube"
        className={styles.youtubeFrame}
        // width={width}
        // height={height}
      />
    </div>
  );
};

export default YouTubeEmbed;
