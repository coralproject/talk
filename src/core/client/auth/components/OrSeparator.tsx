import { Localized } from "fluent-react/compat";
import React from "react";
import { StatelessComponent } from "react";

import HorizontalSeparator from "./HorizontalSeparator";

const OrSeparator: StatelessComponent = () => (
  <Localized id="general-orSeparator">
    <HorizontalSeparator>Or</HorizontalSeparator>
  </Localized>
);

export default OrSeparator;
