import React, { FunctionComponent } from "react";

import IframeEmbed from "./IframeEmbed";

interface Props {
  url: string;
  siteID: string;
}

const ExternalMedia: FunctionComponent<Props> = ({ url, siteID }) => {
  const component = encodeURIComponent(url);
  return (
    <IframeEmbed
      src={`/api/external-media?url=${component}&siteID=${siteID}`}
    />
  );
};

export default ExternalMedia;
