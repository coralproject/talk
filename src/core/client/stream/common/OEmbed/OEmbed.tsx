import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { TextLink } from "coral-ui/components/v2";

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
    <div className={styles.root}>
      <TextLink href={url} className={styles.link} target="_blank">
        {url}
      </TextLink>
      <iframe
        ref={iframeRef}
        title="oEmbed"
        src={`/api/oembed?type=${type}&url=${cleanUrl}`}
        onLoad={onLoad}
        className={styles.frame}
      />
    </div>
  );
};

export default oEmbed;
