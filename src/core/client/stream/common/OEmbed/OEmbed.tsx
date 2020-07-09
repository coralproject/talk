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
    if (width && height) {
      return;
    }
    let resizeInterval: NodeJS.Timeout | null = null;

    let iterations = 0;
    resizeInterval = setInterval(() => {
      if (iterations > 10 && resizeInterval) {
        clearInterval(resizeInterval);
      }
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
          src={`/api/oembed?type=${type}&url=${cleanUrl}&maxWidth=${maxWidth}`}
          onLoad={onLoad}
          className={styles.frame}
          {...attrs}
        />
      )}
    </div>
  );
};

export default oEmbed;
