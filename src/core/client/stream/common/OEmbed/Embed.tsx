import { GQLEMBED_SOURCE_RL } from "coral-framework/schema";
import { TwitterEmbed, YouTubeEmbed } from "coral-stream/common/OEmbed";
import React, { FunctionComponent } from "react";

interface Props {
  url: string;
  type: GQLEMBED_SOURCE_RL;
  settings: {
    twitter: boolean;
    giphy: boolean;
    youtube: boolean;
  };
}

const Embed: FunctionComponent<Props> = ({ type, url, settings }) => {
  if (type === "TWITTER" && settings.twitter) {
    return <TwitterEmbed url={url} />;
  }

  if (type === "YOUTUBE" && settings.youtube) {
    return <YouTubeEmbed url={url} />;
  }

  if (type === "GIPHY" && settings.giphy) {
    return <img src={url} alt="" />;
  }

  return null;
};

export default Embed;
