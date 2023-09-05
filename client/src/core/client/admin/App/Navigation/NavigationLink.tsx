import { Link, LocationDescriptor } from "found";
import React, { FunctionComponent } from "react";

import { AppBarNavigationItem } from "coral-ui/components/v2";

interface Props {
  children: React.ReactNode;
  to: string | LocationDescriptor;
}

const NavigationLink: FunctionComponent<Props> = (props) => (
  <Link to={props.to} as={AppBarNavigationItem as any} activePropName="active">
    {props.children}
  </Link>
);

export default NavigationLink;
