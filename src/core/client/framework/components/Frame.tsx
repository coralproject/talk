import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
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
  wasToggled?: boolean;
  type?: "youtube" | "twitter" | "external_media";
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
  wasToggled,
  type,
}) => {
  const { postMessage, rootURL } = useCoralContext();
  const [height, setHeight] = useState(0);
  // TODO: Make these constants and add comment about Youtube video thumbnail height
  const [maxHeight, setMaxHeight] = useState<string>(
    type === "twitter" || type === "external_media"
      ? wasToggled
        ? "none"
        : "250px"
      : "168px"
  );
  const [displayExpand, setDisplayExpand] = useState(
    type === "twitter" || type === "external_media"
      ? wasToggled
        ? "none"
        : "flex"
      : "none"
  );
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
          sandbox={sandboxStr}
          scrolling="no"
        />
      </div>
      {/* todo: need solution with background or something for external media that
      has height smaller than the default shown */}
      {/* todo: localize */}
      {(height === 0 || height > 250) && (
        <div className={styles.expand} style={{ display: `${displayExpand}` }}>
          <Button
            color="stream"
            onClick={() => {
              setMaxHeight("none");
              setDisplayExpand("none");
            }}
            variant="text"
          >
            Expand
          </Button>
        </div>
      )}
    </>
  );
};

export default Frame;
