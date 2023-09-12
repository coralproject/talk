import { Link, LocationDescriptor } from "found";
import React, { FunctionComponent } from "react";

import { SubBarNavigationItem } from "coral-ui/components/v2";

interface Props {
  children: React.ReactNode;
  to: LocationDescriptor;
}

const NavigationLink: FunctionComponent<Props> = (props) => (
  <Link to={props.to} as={SubBarNavigationItem as any} activePropName="active">
    {props.children}
  </Link>
);

export default NavigationLink;
