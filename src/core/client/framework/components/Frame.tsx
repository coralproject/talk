import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { v1 as uuid } from "uuid";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import modifyQuery from "coral-framework/utils/modifyQuery";

interface Props {
  id?: string;
  src: string;
  sandbox?: boolean;
  title?: string;
}

export interface FrameHeightMessage {
  height: number;
  frameID: string;
}

const iframeStyle = { display: "block" };

const Frame: FunctionComponent<Props> = ({ id, src, sandbox, title }) => {
  const { postMessage } = useCoralContext();
  const [height, setHeight] = useState(0);
  const frameID = useMemo(
    () => (id ? `frame-id-${id}-${uuid()}` : `frame-uuid-${uuid()}`),
    [id]
  );
  const url = modifyQuery(src, { frameID });
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
    <div id={frameID}>
      <iframe
        title={title}
        frameBorder={0}
        style={iframeStyle}
        src={url}
        height={height}
        sandbox={sandboxStr}
      />
    </div>
  );
};

export default Frame;
