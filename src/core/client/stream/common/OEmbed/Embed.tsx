import { GQLEMBED_SOURCE_RL } from "coral-framework/schema";
import { TwitterEmbed, YouTubeEmbed } from "coral-stream/common/OEmbed";
import React, { FunctionComponent } from "react";

interface Props {
  url: string;
  type: GQLEMBED_SOURCE_RL;
  width?: string | null;
  height?: string | null;
  video: string | null;
  title: string | null;
  settings: {
    twitter: boolean;
    giphy: boolean;
    youtube: boolean;
  };
}

const Embed: FunctionComponent<Props> = ({
  type,
  url,
  settings,
  title,
  video,
  width,
  height,
}) => {
  if (type === "TWITTER" && settings.twitter) {
    return <TwitterEmbed url={url} width={width} />;
  }

  if (type === "YOUTUBE" && settings.youtube) {
    return <YouTubeEmbed url={url} width={width} height={height} />;
  }

  if (type === "GIPHY" && settings.giphy && video) {
    return (
      <video
        width={width || undefined}
        height={height || undefined}
        autoPlay
        loop
      >
        <source src={video} type="video/mp4" />
      </video>
    );
  }

  return null;
};

export default Embed;
