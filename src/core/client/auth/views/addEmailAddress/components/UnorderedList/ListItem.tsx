import React from "react";
import { StatelessComponent } from "react";

import { Icon } from "talk-ui/components";

import styles from "./ListItem.css";

interface Props {
  icon?: React.ReactNode;
}

const ListItem: StatelessComponent<Props> = props => (
  <li className={styles.root}>
    <div className={styles.leftCol}>{props.icon}</div>
    <div>{props.children}</div>
  </li>
);

ListItem.defaultProps = {
  icon: <Icon>keyboard_arrow_right</Icon>,
};

export default ListItem;
