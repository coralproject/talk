import { GQLEMBED_SOURCE } from "coral-framework/schema";
import { TwitterEmbed, YouTubeEmbed } from "coral-stream/common/OEmbed";
import React, { FunctionComponent } from "react";

interface Props {
  url: string;
  type: GQLEMBED_SOURCE;
  settings: {
    twitter: boolean;
    giphy: boolean;
    youtube: boolean;
  };
}

const Embed: FunctionComponent<Props> = ({ type, url, settings }) => {
  if (type === GQLEMBED_SOURCE.TWITTER && settings.twitter) {
    return <TwitterEmbed url={url} />;
  }

  if (type === GQLEMBED_SOURCE.YOUTUBE && settings.youtube) {
    return <YouTubeEmbed url={url} />;
  }

  if (type === GQLEMBED_SOURCE.GIPHY && settings.giphy) {
    return <img src={url} alt="" />;
  }

  return null;
};

export default Embed;
