import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import Subheader from "../components/Subheader";

const ConfigurationSubHeader: StatelessComponent<{}> = () => (
  <Localized id="configure-configurationSubHeader" strong={<strong />}>
    <Subheader>Configuration</Subheader>
  </Localized>
);

export default ConfigurationSubHeader;
