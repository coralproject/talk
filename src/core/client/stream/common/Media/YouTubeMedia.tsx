import React, { FunctionComponent } from "react";

import OEmbed from "./OEmbed";

interface Props {
  url: string;
  width?: number | null;
  height?: number | null;
  siteID: string;
}

const YouTubeMedia: FunctionComponent<Props> = ({
  url,
  width,
  height,
  siteID,
}) => {
  return (
    <OEmbed
      url={url}
      width={width}
      height={height}
      type="youtube"
      siteID={siteID}
    />
  );
};

export default YouTubeMedia;
