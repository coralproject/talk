import React, { FunctionComponent, HTMLProps, useCallback } from "react";

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

  const onLoad = useCallback(() => {
    if (width && height) {
      return;
    }
    let resizeInterval: NodeJS.Timeout | null = null;

    let iterations = 0;
    resizeInterval = setInterval(() => {
      if (!iframeRef.current || !iframeRef.current.contentWindow) {
        return;
      }
      if (!width) {
        iframeRef.current.width = `${iframeRef.current.contentWindow.document.body.scrollWidth}px`;
      }
      if (!height) {
        iframeRef.current.height = `${iframeRef.current.contentWindow.document.body.scrollHeight}px`;
      }
      iterations = iterations + 1;
      if (iterations > 10 && resizeInterval) {
        clearInterval(resizeInterval);
      }
    }, 500);
  }, [iframeRef.current, width, height]);

  return (
    <iframe
      frameBorder="0"
      allowFullScreen
      scrolling="no"
      ref={iframeRef}
      title="oEmbed"
      src={`/api/oembed?type=${type}&url=${cleanUrl}`}
      onLoad={onLoad}
      className={className}
      {...attrs}
    />
  );
};

export default oEmbed;
