import { Link, LocationDescriptor } from "found";
import React, { FunctionComponent } from "react";

import { SubBarNavigationItem } from "coral-ui/components";

interface Props {
  children: React.ReactNode;
  to: string | LocationDescriptor;
}

const NavigationLink: FunctionComponent<Props> = props => (
  <Link to={props.to} Component={SubBarNavigationItem} activePropName="active">
    {props.children}
  </Link>
);

export default NavigationLink;
