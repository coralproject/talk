import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

const NotAvailable: StatelessComponent = props => (
  <Localized id="community-notAvailable">
    <span>Not available</span>
  </Localized>
);

export default NotAvailable;
