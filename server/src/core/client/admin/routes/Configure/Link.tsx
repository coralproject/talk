import { Link as FoundLink, LocationDescriptor } from "found";
import React, { FunctionComponent } from "react";

import styles from "./Link.css";

interface Props {
  className?: string;
  children?: React.ReactNode | any;
  to: string | LocationDescriptor;
  exact?: boolean;
}

const Link: FunctionComponent<Props> = (props) => (
  <li className={props.className}>
    <FoundLink
      to={props.to}
      className={styles.link}
      activeClassName={styles.linkActive}
      exact={props.exact}
    >
      {props.children}
    </FoundLink>
  </li>
);

export default Link;
