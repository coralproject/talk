import React, { FunctionComponent, HTMLProps } from "react";

interface Props {
  url: string;
  type: string;
  loadTimeout?: number;
  showLink?: boolean;
  className?: string;
  width?: string | null;
  height?: string | null;
}

const oEmbed: FunctionComponent<Props> = ({
  url,
  type,
  loadTimeout = 10000,
  showLink = true,
  className,
  width,
  height,
}) => {
  const iframeRef = React.createRef<HTMLIFrameElement>();
  const cleanUrl = encodeURIComponent(url);
  const attrs: HTMLProps<HTMLIFrameElement> = {};
  if (width) {
    attrs.width = width;
  }
  if (height) {
    attrs.height = height;
  }

  return (
    <iframe
      frameBorder="0"
      allowFullScreen
      scrolling="no"
      ref={iframeRef}
      title="oEmbed"
      src={`/api/oembed?type=${type}&url=${cleanUrl}`}
      className={className}
      {...attrs}
    />
  );
};

export default oEmbed;
