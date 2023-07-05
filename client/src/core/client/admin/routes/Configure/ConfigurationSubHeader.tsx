import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import Subheader from "./Subheader";

const ConfigurationSubHeader: FunctionComponent<{}> = () => (
  <Localized
    id="configure-configurationSubHeader"
    elems={{ strong: <strong /> }}
  >
    <Subheader>Configuration</Subheader>
  </Localized>
);

export default ConfigurationSubHeader;
