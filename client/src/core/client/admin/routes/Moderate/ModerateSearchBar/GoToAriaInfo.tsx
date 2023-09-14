import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { AriaInfo } from "coral-ui/components/v2";

const GoToAriaInfo: FunctionComponent = () => (
  <Localized id="moderate-searchBar-goTo">
    <AriaInfo>Go to</AriaInfo>
  </Localized>
);

export default GoToAriaInfo;
