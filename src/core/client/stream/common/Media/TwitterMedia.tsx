import React, { FunctionComponent } from "react";

import OEmbed from "./OEmbed";

interface Props {
  url: string;
  width?: number | null;
  siteID: string;
}

const TwitterMedia: FunctionComponent<Props> = ({ url, width, siteID }) => {
  return <OEmbed url={url} type="twitter" siteID={siteID} />;
};

export default TwitterMedia;
