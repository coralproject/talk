import React, { FunctionComponent } from "react";

import OEmbed from "./OEmbed";

interface Props {
  url: string;
  width?: number | null;
}

const TwitterMedia: FunctionComponent<Props> = ({ url, width }) => {
  return <OEmbed url={url} type="twitter" />;
};

export default TwitterMedia;
