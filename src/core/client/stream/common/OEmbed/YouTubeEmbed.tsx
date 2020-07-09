import React, { FunctionComponent } from "react";

import OEmbed from "./OEmbed";

interface Props {
  url: string;
  width?: string | null;
  height?: string | null;
}

const YouTubeEmbed: FunctionComponent<Props> = ({ url, height, width }) => {
  return <OEmbed url={url} type="youtube" />;
};

export default YouTubeEmbed;
