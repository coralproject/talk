import React, {
  FunctionComponent,
  HTMLProps,
  useCallback,
  useEffect,
  useState,
} from "react";

import styles from "./OEmbed.css";

interface Props {
  url: string;
  type: string;
  loadTimeout?: number;
  showLink?: boolean;
  className?: string;
  width?: number | null;
  height?: number | null;
  siteID: string;
}

function calculateBottomPadding(width: string, height: string) {
  return `${(parseInt(height, 10) / parseInt(width, 10)) * 100}%`;
}

const oEmbed: FunctionComponent<Props> = ({
  url,
  type,
  className,
  width,
  height,
  siteID,
}) => {
  const iframeRef = React.createRef<HTMLIFrameElement>();
  const containerRef = React.createRef<HTMLDivElement>();
  const cleanUrl = encodeURIComponent(url);
  const [maxWidth, setMaxWidth] = useState<number | null>(null);
  const attrs: HTMLProps<HTMLIFrameElement> = {};
  if (width) {
    attrs.width = width;
  }
  if (height) {
    attrs.height = height;
  }

  useEffect(() => {
    if (containerRef.current) {
      setMaxWidth(containerRef.current.offsetWidth);
    }
  }, [containerRef.current, maxWidth]);

  const onLoad = useCallback(() => {
    if (width && height && containerRef && containerRef.current) {
      containerRef.current.style.paddingBottom = `${(height / width) * 100}%`;
      return;
    }
    let resizeInterval: number | null = null;

    let iterations = 0;
    resizeInterval = window.setInterval(() => {
      if (iterations > 10 && resizeInterval) {
        clearInterval(resizeInterval);
      }
      if (!iframeRef.current || !iframeRef.current.contentWindow) {
        return;
      }
      let calculatedWidth = `${width}`;
      let calculatedHeight = `${height}`;
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
        containerRef.current.style.paddingBottom = calculateBottomPadding(
          calculatedWidth,
          calculatedHeight
        );
      }
      iterations = iterations + 1;
    }, 100);
  }, [iframeRef, iframeRef.current, containerRef.current, width, height]);

  return (
    <div className={styles.container} ref={containerRef}>
      {maxWidth && (
        <iframe
          frameBorder="0"
          allowFullScreen
          scrolling="no"
          ref={iframeRef}
          title="oEmbed"
          src={`/api/oembed?type=${type}&url=${cleanUrl}&maxWidth=${maxWidth}&siteID=${siteID}`}
          onLoad={onLoad}
          className={styles.frame}
          {...attrs}
        />
      )}
    </div>
  );
};

export default oEmbed;
