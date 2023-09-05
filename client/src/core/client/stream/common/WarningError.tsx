import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { VIEWER_STATUS_CONTAINER_ID } from "coral-stream/constants";

const WarningError: FunctionComponent = () => (
  <Localized
    id="warning-notice"
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    elems={{ a: <a href={`#${VIEWER_STATUS_CONTAINER_ID}`} /> }}
  >
    <div>
      Your account has been issued a warning. To continue participating please{" "}
      <a href={`#${VIEWER_STATUS_CONTAINER_ID}`}>review the warning message</a>.
    </div>
  </Localized>
);

export default WarningError;
