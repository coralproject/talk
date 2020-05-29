import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";

import styles from "./OEmbed.css";

interface Props {
  url: string;
  type: string;
  loadTimeout?: number;
}

const oEmbed: FunctionComponent<Props> = ({
  url,
  type,
  loadTimeout = 10000,
}) => {
  const iframeRef = React.createRef<HTMLIFrameElement>();
  const step = 300;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    let resizeInterval: NodeJS.Timeout | null = null;
    let timer = 0;

    const resize = () => {
      if (!iframeRef.current || !iframeRef.current.contentWindow) {
        return;
      }

      iframeRef.current.style.height =
        iframeRef.current.contentWindow.document.body.scrollHeight + "px";

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
    <iframe
      ref={iframeRef}
      title="oEmbed"
      src={`/api/oembed?type=${type}&url=${encodeURIComponent(url)}`}
      onLoad={onLoad}
      className={styles.frame}
    />
  );
};

export default oEmbed;
