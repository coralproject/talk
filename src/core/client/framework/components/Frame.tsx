import pym, { ParentSettings } from "pym.js";
import React, { FunctionComponent, useEffect, useMemo } from "react";
import { v1 as uuid } from "uuid";

import { Spinner } from "coral-ui/components/v2";

interface Props {
  id?: string;
  src: string;
  sandbox?: boolean;
}

const Frame: FunctionComponent<Props> = ({ id, src, sandbox }) => {
  const containerID = useMemo(
    () => (id ? `frame-id-${id}` : `frame-uuid-${uuid()}`),
    [id]
  );

  useEffect(() => {
    // Create the configuration used for the iframe.
    const config: ParentSettings = {
      optionalparams: false,
    };
    if (sandbox) {
      // The resizing behavior with pym requires script support.
      config.sandbox = "allow-same-origin allow-scripts";
    }

    // Create the new frame for the specific src.
    const parent = new pym.Parent(containerID, src, config);

    // When this component does unmount or the properties change, remove the old
    // one so we can re-create it.
    return () => {
      parent.remove();
    };
  }, [containerID, sandbox, src]);

  return (
    <div id={containerID}>
      {/* pym will replace the spinner with the iframe when it loads up */}
      <Spinner />
    </div>
  );
};

export default Frame;
