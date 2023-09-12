import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

const EmptySitesMessage: FunctionComponent = (props) => (
  <Localized id="sites-emptyMessage">
    <div>We could not find any sites matching your criteria.</div>
  </Localized>
);

export default EmptySitesMessage;
