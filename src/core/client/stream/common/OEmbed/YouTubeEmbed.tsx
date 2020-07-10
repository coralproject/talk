import React, { FunctionComponent } from "react";

import OEmbed from "./OEmbed";

interface Props {
  url: string;
}

const YouTubeEmbed: FunctionComponent<Props> = ({ url }) => {
  return <OEmbed url={url} type="youtube" />;
};

export default YouTubeEmbed;
