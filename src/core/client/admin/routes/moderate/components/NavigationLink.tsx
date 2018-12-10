import { Link, LocationDescriptor } from "found";
import React, { StatelessComponent } from "react";

import { SubBarNavigationItem } from "talk-ui/components";

interface Props {
  children: React.ReactNode;
  to: string | LocationDescriptor;
}

const NavigationLink: StatelessComponent<Props> = props => (
  <Link to={props.to} Component={SubBarNavigationItem} activePropName="active">
    {props.children}
  </Link>
);

export default NavigationLink;
