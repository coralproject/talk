import React, { FunctionComponent } from "react";

import IframeEmbed from "./IframeEmbed";

interface Props {
  url: string;
  width?: number | null;
  siteID: string;
}

const ExternalMedia: FunctionComponent<Props> = ({ url, width, siteID }) => {
  const cleanUrl = encodeURIComponent(url);
  return (
    <IframeEmbed src={`/api/external-media?url=${cleanUrl}&siteID=${siteID}`} />
  );
};

export default ExternalMedia;
