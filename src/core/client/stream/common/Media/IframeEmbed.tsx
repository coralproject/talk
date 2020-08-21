import React, {
  FunctionComponent,
  HTMLProps,
  useCallback,
  useEffect,
  useState,
} from "react";

import styles from "./OEmbed.css";

interface Props {
  src: string;
  loadTimeout?: number;
  showLink?: boolean;
  width?: number | null;
  height?: number | null;
}

function calculateBottomPadding(width: number, height: number) {
  return `${(height / width) * 100}%`;
}

const IframeEmbed: FunctionComponent<Props> = ({ width, height, src }) => {
  const iframeRef = React.createRef<HTMLIFrameElement>();
  const containerRef = React.createRef<HTMLDivElement>();
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
  }, [containerRef, maxWidth]);

  const onLoad = useCallback(() => {
    if (width && height && containerRef && containerRef.current) {
      containerRef.current.style.paddingBottom = calculateBottomPadding(
        width,
        height
      );
      return;
    }
    let resizeInterval: number | null = null;

    let iterations = 0;
    resizeInterval = window.setInterval(() => {
      if (iterations > 100 && resizeInterval) {
        clearInterval(resizeInterval);
      }
      iterations = iterations + 1;
      if (!iframeRef.current || !iframeRef.current.contentWindow) {
        return;
      }
      let calculatedWidth = width;
      let calculatedHeight = height;
      let desiredWidth;
      let desiredHeight;
      if (!width) {
        calculatedWidth =
          iframeRef.current.contentWindow.document.body.scrollWidth;
        desiredWidth = calculatedWidth;
        if (maxWidth && calculatedWidth > maxWidth) {
          desiredWidth = maxWidth;
        }
        if (`${calculatedWidth}` !== iframeRef.current.width) {
          iframeRef.current.width = `${desiredWidth}px`;
        }
      }
      if (!height) {
        calculatedHeight =
          iframeRef.current.contentWindow.document.body.scrollHeight;
        desiredHeight = calculatedHeight;
        if (maxWidth && calculatedWidth && calculatedWidth > maxWidth) {
          desiredHeight = (calculatedWidth / calculatedHeight) * maxWidth;
        }
        if (`${calculatedHeight}` !== iframeRef.current.height) {
          iframeRef.current.height = `${desiredHeight}px`;
        }
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
    }, 100);
  }, [iframeRef, containerRef, width, height, maxWidth]);

  return (
    <div className={styles.container} ref={containerRef}>
      {maxWidth && (
        <iframe
          frameBorder="0"
          allowFullScreen
          scrolling="no"
          ref={iframeRef}
          title="oEmbed"
          src={`${src}&maxWidth=${maxWidth}`}
          onLoad={onLoad}
          className={styles.frame}
          {...attrs}
        />
      )}
    </div>
  );
};

export default IframeEmbed;
