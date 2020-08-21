import React, { FunctionComponent } from "react";

import IframeEmbed from "./IframeEmbed";

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
  const cleanUrl = encodeURIComponent(url);
  return (
    <IframeEmbed
      src={`/api/oembed?type=youtube&url=${cleanUrl}&siteID=${siteID}`}
      width={width}
      height={height}
    />
  );
};

export default YouTubeMedia;
