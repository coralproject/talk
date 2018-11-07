import { Link as FoundLink, LocationDescriptor } from "found";
import React, { StatelessComponent } from "react";

import styles from "./Link.css";

interface Props {
  className?: string;
  children: React.ReactNode;
  to: string | LocationDescriptor;
}

const Link: StatelessComponent<Props> = props => (
  <li className={props.className}>
    <FoundLink
      to={props.to}
      className={styles.link}
      activeClassName={styles.linkActive}
    >
      {props.children}
    </FoundLink>
  </li>
);

export default Link;
