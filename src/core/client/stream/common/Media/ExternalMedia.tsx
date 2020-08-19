import React, { FunctionComponent } from "react";

import OEmbed from "./OEmbed";

interface Props {
  url: string;
  width?: number | null;
  siteID: string;
}

const ExternalMedia: FunctionComponent<Props> = ({ url, width, siteID }) => {
  return <OEmbed url={url} type="external" siteID={siteID} />;
};

export default ExternalMedia;
