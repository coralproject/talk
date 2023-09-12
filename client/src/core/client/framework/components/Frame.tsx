import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v1 as uuid } from "uuid";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import modifyQuery from "coral-framework/utils/modifyQuery";
import { Button } from "coral-ui/components/v2";

import styles from "./Frame.css";

interface Props {
  id?: string;
  src: string;
  sandbox?: boolean;
  title?: string;
  isToggled?: boolean;
  width?: string;
  showFullHeight?: boolean;
  type?: "twitter" | "youtube" | "external_media";
  mobile?: boolean;
}

export interface FrameHeightMessage {
  height: number;
  frameID: string;
}
const iframeStyle = { display: "block" };
const Frame: FunctionComponent<Props> = ({
  id,
  src,
  sandbox,
  title,
  isToggled,
  width,
  showFullHeight,
  type,
  mobile,
}) => {
  const { postMessage, rootURL } = useCoralContext();
  const [height, setHeight] = useState(0);
  const defaultUnexpandedHeight = useMemo(() => {
    return mobile ? 160 : 250;
  }, [mobile]);
  const [maxHeight, setMaxHeight] = useState<string>(
    isToggled || showFullHeight ? "none" : `${defaultUnexpandedHeight}px`
  );
  const [displayExpand, setDisplayExpand] = useState(
    isToggled || showFullHeight ? "none" : "flex"
  );
  const expandWidth = useMemo(() => {
    if (type === "twitter") {
      return "550px";
    }
    // use width for youtube and external media
    return width;
  }, [type]);
  const frameID = useMemo(
    () => (id ? `frame-id-${id}-${uuid()}` : `frame-uuid-${uuid()}`),
    [id]
  );
  const url = useMemo(() => {
    return modifyQuery(`${rootURL}${src}`, { frameID });
  }, [frameID, rootURL, src]);
  const sandboxStr = sandbox ? "allow-same-origin allow-scripts" : undefined;
  useEffect(() => {
    const unlisten = postMessage.on(
      "frameHeight",
      (data: FrameHeightMessage) => {
        if (data.frameID !== frameID) {
          return;
        }
        setHeight(data.height);
      }
    );
    return unlisten;
  }, [frameID, postMessage]);

  const onExpand = useCallback(() => {
    setMaxHeight("none");
    setDisplayExpand("none");
  }, [setMaxHeight, setDisplayExpand]);

  return (
    <>
      <div
        id={frameID}
        className={styles.iframeContainer}
        style={{ maxHeight: `${maxHeight}`, minHeight: `${maxHeight}` }}
      >
        <iframe
          title={title}
          frameBorder={0}
          style={{ ...iframeStyle, maxHeight: `${maxHeight}` }}
          src={url}
          height={height}
          width={width}
          sandbox={sandboxStr}
          scrolling="no"
          allowFullScreen
          allow="fullscreen;"
        />
      </div>
      {(height === 0 || height > defaultUnexpandedHeight) && (
        <div
          className={styles.expand}
          style={{ display: `${displayExpand}`, width: `${expandWidth}` }}
        >
          <Localized id="comments-embedLinks-expand">
            <Button color="stream" onClick={onExpand} variant="text">
              Expand
            </Button>
          </Localized>
        </div>
      )}
    </>
  );
};

export default Frame;
