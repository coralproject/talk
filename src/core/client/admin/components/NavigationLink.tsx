import { Link, LocationDescriptor } from "found";
import React, { StatelessComponent } from "react";

import styles from "./NavigationLink.css";

interface Props {
  children: React.ReactNode;
  to: string | LocationDescriptor;
}

const NavigationLink: StatelessComponent<Props> = props => (
  <Link to={props.to} className={styles.root} activeClassName={styles.active}>
    {props.children}
  </Link>
);

export default NavigationLink;
