import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";

// import { TextLink } from "coral-ui/components/v2";

import styles from "./OEmbed.css";

interface Props {
  url: string;
  type: string;
  loadTimeout?: number;
  showLink?: boolean;
}

const oEmbed: FunctionComponent<Props> = ({
  url,
  type,
  loadTimeout = 10000,
  showLink = true,
}) => {
  const iframeRef = React.createRef<HTMLIFrameElement>();
  const divRef = React.createRef<HTMLDivElement>();
  const step = 300;
  const [loaded, setLoaded] = useState(false);
  const cleanUrl = encodeURIComponent(url);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    let resizeInterval: NodeJS.Timeout | null = null;
    let timer = 0;

    const resize = () => {
      if (
        !iframeRef.current ||
        !iframeRef.current.contentWindow ||
        !divRef.current
      ) {
        return;
      }

      const height = iframeRef.current.contentWindow.document.body.scrollHeight;
      // const width = iframeRef.current.contentWindow.document.body.scrollWidth;
      // const aspectRatio = height / width;
      // console.log(width, height, aspectRatio);
      // divRef.current.style.paddingBottom = aspectRatio * 100 + "%";

      iframeRef.current.style.height = height + "px";

      timer += step;

      // clear interval after we hit timeout
      if (timer > loadTimeout && resizeInterval !== null) {
        clearInterval(resizeInterval);
        resizeInterval = null;
      }
    };

    resizeInterval = setTimeout(resize, step);

    return () => {
      if (resizeInterval !== null) {
        clearInterval(resizeInterval);
        resizeInterval = null;
      }
    };
  }, [iframeRef.current, loadTimeout, step, loaded]);

  const onLoad = useCallback(() => {
    setLoaded(true);
  }, [setLoaded]);

  return (
    <div className={styles.root}>
      {/* <TextLink href={url} className={styles.link} target="_blank">
        {url}
      </TextLink> */}
      <div className={styles.scalableEmbed} ref={divRef}>
        <iframe
          frameBorder="0"
          allowFullScreen
          ref={iframeRef}
          title="oEmbed"
          src={`/api/oembed?type=${type}&url=${cleanUrl}`}
          onLoad={onLoad}
          className={styles.frame}
        />
      </div>
    </div>
  );
};

export default oEmbed;
