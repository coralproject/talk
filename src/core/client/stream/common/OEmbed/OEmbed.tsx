import React, { FunctionComponent, HTMLProps, useCallback } from "react";

import styles from "./OEmbed.css";

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
  const containerRef = React.createRef<HTMLDivElement>();
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
      let calculatedWidth = width;
      let calculatedHeight = height;
      if (!width) {
        calculatedWidth = `${iframeRef.current.contentWindow.document.body.scrollWidth}`;
        iframeRef.current.width = `${calculatedWidth}px`;
      }
      if (!height) {
        calculatedHeight = `${iframeRef.current.contentWindow.document.body.scrollHeight}`;
        iframeRef.current.height = `${calculatedHeight}px`;
      }
      if (
        containerRef &&
        containerRef.current &&
        calculatedWidth &&
        calculatedHeight
      ) {
        const paddingBottom = `${
          (parseInt(calculatedHeight, 10) / parseInt(calculatedWidth, 10)) * 100
        }%`;
        containerRef.current.style.paddingBottom = paddingBottom;
      }
      iterations = iterations + 1;
      if (iterations > 10 && resizeInterval) {
        clearInterval(resizeInterval);
      }
    }, 100);
  }, [iframeRef.current, width, height]);

  return (
    <div className={styles.container} ref={containerRef}>
      <iframe
        frameBorder="0"
        allowFullScreen
        scrolling="no"
        ref={iframeRef}
        title="oEmbed"
        src={`/api/oembed?type=${type}&url=${cleanUrl}`}
        onLoad={onLoad}
        className={styles.frame}
        {...attrs}
      />
    </div>
  );
};

export default oEmbed;
