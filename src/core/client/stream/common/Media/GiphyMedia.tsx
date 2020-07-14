import React, { FunctionComponent } from "react";

interface Props {
  url: string;
  width?: number | null;
  height?: number | null;
  video?: string | null;
  title?: string | null;
}

const GiphyMedia: FunctionComponent<Props> = ({
  url,
  title,
  video,
  width,
  height,
}) => {
  return video ? (
    <video
      width={width || undefined}
      height={height || undefined}
      autoPlay
      loop
    >
      <source src={video} type="video/mp4" />
    </video>
  ) : (
    <img src={url} alt={title || ""} />
  );
};

export default GiphyMedia;
