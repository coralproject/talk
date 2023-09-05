import React, { FunctionComponent } from "react";

import { CheckIcon, SvgIcon } from "coral-ui/components/icons";

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
  icon: <SvgIcon Icon={CheckIcon} size="xs" />,
};

export default ListItem;
