import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { AriaInfo } from "talk-ui/components";

const GoToAriaInfo: FunctionComponent = () => (
  <Localized id="moderate-searchBar-goTo">
    <AriaInfo>Go to</AriaInfo>
  </Localized>
);

export default GoToAriaInfo;
