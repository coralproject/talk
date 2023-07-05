import React, { FunctionComponent } from "react";

import { Icon } from "coral-ui/components/v2";

import styles from "./ListItem.css";

interface Props {
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const ListItem: FunctionComponent<Props> = (props) => (
  <li className={styles.root}>
    <div className={styles.leftCol}>{props.icon}</div>
    <div>{props.children}</div>
  </li>
);

ListItem.defaultProps = {
  icon: <Icon>keyboard_arrow_right</Icon>,
};

export default ListItem;
