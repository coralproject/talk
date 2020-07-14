import React, { FunctionComponent } from "react";

import OEmbed from "./OEmbed";

interface Props {
  url: string;
  width?: number | null;
  height?: number | null;
}

const YouTubeEmbed: FunctionComponent<Props> = ({ url, width, height }) => {
  return <OEmbed url={url} width={width} height={height} type="youtube" />;
};

export default YouTubeEmbed;
