import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import HorizontalSeparator from "./HorizontalSeparator";

const OrSeparator: FunctionComponent = () => (
  <Localized id="login-orSeparator">
    <HorizontalSeparator>Or</HorizontalSeparator>
  </Localized>
);

export default OrSeparator;
