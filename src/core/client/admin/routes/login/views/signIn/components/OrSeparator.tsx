import { Localized } from "fluent-react/compat";
import React from "react";
import { FunctionComponent } from "react";

import HorizontalSeparator from "./HorizontalSeparator";

const OrSeparator: FunctionComponent = () => (
  <Localized id="login-signIn-orSeparator">
    <HorizontalSeparator>Or</HorizontalSeparator>
  </Localized>
);

export default OrSeparator;
