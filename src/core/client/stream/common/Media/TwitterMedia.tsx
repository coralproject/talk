import React, { FunctionComponent } from "react";

import IframeEmbed from "./IframeEmbed";

interface Props {
  url: string;
  width?: number | null;
  siteID: string;
}

const TwitterMedia: FunctionComponent<Props> = ({ url, width, siteID }) => {
  const cleanUrl = encodeURIComponent(url);
  return (
    <IframeEmbed
      src={`/api/oembed?type=twitter&url=${cleanUrl}&siteID=${siteID}`}
    />
  );
};

export default TwitterMedia;
